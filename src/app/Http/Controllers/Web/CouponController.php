<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCouponRequest;
use App\Http\Requests\UpdateCouponRequest;
use App\Models\Coupon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CouponController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Coupon::class);

        $user = $request->user();

        $query = $user->coupons()->newQuery();

        $search = $request->string('search')->trim();
        $status = $request->string('status')->trim();
        $sort = $request->string('sort')->trim()->value() ?: 'created_at_desc';

        if ($search->isNotEmpty()) {
            $query->where('title', 'like', '%' . $search->value() . '%');
        }

        if ($status->isNotEmpty()) {
            if ($status->value() === 'used') {
                $query->whereNotNull('used_at');
            } elseif ($status->value() === 'unused') {
                $query->whereNull('used_at');
            }
        }

        switch ($sort) {
            case 'expires_at_desc':
                $query->orderBy('expires_at', 'desc');
                break;
            case 'expires_at_asc':
                $query->orderBy('expires_at');
                break;
            case 'created_at_asc':
                $query->orderBy('created_at', 'asc');
                break;
            case 'created_at_desc':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $coupons = $query->paginate(12)->withQueryString();

        return Inertia::render('Coupons/Index', [
            'coupons' => [
                'data' => $coupons->through(function (Coupon $coupon) {
                    $daysRemaining = now()->startOfDay()->diffInDays($coupon->expires_at, false);

                    return [
                        'id' => $coupon->id,
                        'title' => $coupon->title,
                        'expires_at' => $coupon->expires_at?->toDateString(),
                        'expires_human' => $coupon->expires_at?->format('Y/m/d'),
                        'memo' => $coupon->memo,
                        'image_url' => $coupon->image_path ? Storage::disk('public')->url($coupon->image_path) : null,
                        'used_at' => $coupon->used_at?->toDateTimeString(),
                        'status' => $coupon->used_at ? 'used' : 'unused',
                        'days_remaining' => $daysRemaining,
                        'is_expired' => $daysRemaining < 0,
                        'badge' => $daysRemaining < 0 ? 'expired' : ($daysRemaining <= 3 ? 'danger' : ($daysRemaining <= 7 ? 'warning' : null)),
                    ];
                }),
                'meta' => [
                    'current_page' => $coupons->currentPage(),
                    'last_page' => $coupons->lastPage(),
                    'per_page' => $coupons->perPage(),
                    'total' => $coupons->total(),
                ],
            ],
            'filters' => [
                'search' => $search->isNotEmpty() ? $search->value() : null,
                'status' => $status->isNotEmpty() ? $status->value() : null,
                'sort' => $sort,
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Coupon::class);

        return Inertia::render('Coupons/Create');
    }

    public function store(StoreCouponRequest $request): RedirectResponse
    {
        $this->authorize('create', Coupon::class);

        $data = $request->validated();

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('coupons', 'public');
        }

        $request->user()->coupons()->create([
            'title' => $data['title'],
            'expires_at' => $data['expires_at'],
            'memo' => $data['memo'] ?? null,
            'image_path' => $imagePath,
        ]);

        return redirect()->route('coupons.index')->with('success', 'クーポンを登録しました。');
    }

    public function show(Coupon $coupon): Response
    {
        $this->authorize('view', $coupon);

        return Inertia::render('Coupons/Show', [
            'coupon' => $this->formatCoupon($coupon),
        ]);
    }

    public function edit(Coupon $coupon): Response
    {
        $this->authorize('update', $coupon);

        return Inertia::render('Coupons/Edit', [
            'coupon' => $this->formatCoupon($coupon),
        ]);
    }

    public function update(UpdateCouponRequest $request, Coupon $coupon): RedirectResponse
    {
        $this->authorize('update', $coupon);

        $data = $request->validated();

        $imagePath = $coupon->image_path;

        if ($request->boolean('remove_image') && $imagePath) {
            Storage::disk('public')->delete($imagePath);
            $imagePath = null;
        }

        if ($request->hasFile('image')) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('coupons', 'public');
        }

        $coupon->update([
            'title' => $data['title'],
            'expires_at' => $data['expires_at'],
            'memo' => $data['memo'] ?? null,
            'image_path' => $imagePath,
        ]);

        return redirect()->route('coupons.show', $coupon)->with('success', 'クーポンを更新しました。');
    }

    public function destroy(Request $request, Coupon $coupon): RedirectResponse
    {
        $this->authorize('delete', $coupon);

        $imagePath = $coupon->image_path;
        $coupon->delete();

        if ($imagePath) {
            Storage::disk('public')->delete($imagePath);
        }

        return redirect()->route('coupons.index')->with('success', 'クーポンを削除しました。');
    }

    public function toggle(Request $request, Coupon $coupon): RedirectResponse
    {
        $this->authorize('update', $coupon);

        if ($coupon->used_at) {
            $coupon->markAsUnused();
        } else {
            $coupon->markAsUsed();
        }

        return back()->with('success', '使用状態を更新しました。');
    }

    /**
     * @return array<string, mixed>
     */
    private function formatCoupon(Coupon $coupon): array
    {
        $daysRemaining = now()->startOfDay()->diffInDays($coupon->expires_at, false);

        return [
            'id' => $coupon->id,
            'title' => $coupon->title,
            'expires_at' => $coupon->expires_at?->toDateString(),
            'expires_human' => $coupon->expires_at?->format('Y/m/d'),
            'memo' => $coupon->memo,
            'image_url' => $coupon->image_path ? Storage::disk('public')->url($coupon->image_path) : null,
            'used_at' => $coupon->used_at?->toDateTimeString(),
            'status' => $coupon->used_at ? 'used' : 'unused',
            'days_remaining' => $daysRemaining,
            'is_expired' => $daysRemaining < 0,
            'badge' => $daysRemaining < 0 ? 'expired' : ($daysRemaining <= 3 ? 'danger' : ($daysRemaining <= 7 ? 'warning' : null)),
        ];
    }
}

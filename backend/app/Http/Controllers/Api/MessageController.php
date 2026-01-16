<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * GET /api/messages?user={id}
     */
    public function index(Request $request)
    {
        $request->validate([
            'user' => ['required', 'integer', 'exists:users,id'],
        ]);

        $authId = $request->user()->id;
        $otherUserId = (int) $request->query('user');

        if ($otherUserId === $authId) {
            return response()->json([
                'message' => 'Cannot load conversation with yourself.',
            ], 422);
        }

        User::findOrFail($otherUserId);

        Message::where('sender_id', $otherUserId)
            ->where('receiver_id', $authId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $messages = Message::query()
            ->where(function ($query) use ($authId, $otherUserId) {
                $query->where('sender_id', $authId)
                    ->where('receiver_id', $otherUserId);
            })
            ->orWhere(function ($query) use ($authId, $otherUserId) {
                $query->where('sender_id', $otherUserId)
                    ->where('receiver_id', $authId);
            })
            ->with(['sender', 'receiver', 'vehicle'])
            ->orderBy('created_at')
            ->get();

        return response()->json($messages);
    }

    /**
     * GET /api/messages/threads
     */
    public function threads(Request $request)
    {
        $authId = $request->user()->id;

        $messages = Message::query()
            ->where(function ($query) use ($authId) {
                $query->where('sender_id', $authId)
                    ->orWhere('receiver_id', $authId);
            })
            ->with(['sender', 'receiver', 'vehicle'])
            ->orderByDesc('created_at')
            ->get();

        $threads = $messages
            ->groupBy(function (Message $message) use ($authId) {
                return $message->sender_id === $authId
                    ? $message->receiver_id
                    : $message->sender_id;
            })
            ->map(function ($group) {
                return $group->first();
            })
            ->values();

        return response()->json($threads);
    }

    /**
     * POST /api/messages
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => ['required', 'integer', 'exists:users,id'],
            'vehicle_id' => ['nullable', 'integer', 'exists:vehicles,id'],
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $authId = $request->user()->id;

        if ($validated['receiver_id'] === $authId) {
            return response()->json([
                'message' => 'Cannot send message to yourself.',
            ], 422);
        }

        $message = Message::create([
            'sender_id' => $authId,
            'receiver_id' => $validated['receiver_id'],
            'vehicle_id' => $validated['vehicle_id'] ?? null,
            'message' => $validated['message'],
            'is_read' => false,
        ]);

        return response()->json(
            $message->load(['sender', 'receiver', 'vehicle']),
            201
        );
    }
}

<?php

namespace App\Http\Controllers;

use App\Events\ParticipantUpdated;
use App\Models\Choice;
use App\Models\Participant;
use Illuminate\Http\Request;

class ParticipantController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $participant = Participant::create([
            'name' => $request->name,
        ]);

        return response()->json($participant);
    }

    public function select(Request $request)
    {
        $request->validate([
            'participantId' => 'required|exists:participants,id',
            'choiceId' => 'required|exists:choices,id',
        ]);

        $participant = Participant::findOrFail($request->participantId);
        $choice = Choice::findOrFail($request->choiceId);

        $participant->choices()->attach($choice->id);

        // 全ての選択肢を選択したかチェック
        $totalChoices = Choice::count();
        $selectedChoices = $participant->choices()->count();

        if ($selectedChoices === $totalChoices) {
            $participant->update(['is_complete' => true]);
        }

        broadcast(new ParticipantUpdated($participant))->toOthers();

        return response()->json($participant->load('choices'));
    }

    public function index()
    {
        $participants = Participant::with('choices')->get();
        return response()->json($participants);
    }
}

<?php

namespace App\Http\Controllers;

use App\Events\ChoiceAdded;
use App\Models\Choice;
use Illuminate\Http\Request;

class ChoiceController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'text' => 'required|string|max:255',
        ]);

        $choice = Choice::create([
            'text' => $request->text,
        ]);

        broadcast(new ChoiceAdded($choice))->toOthers();

        return response()->json($choice);
    }

    public function index()
    {
        $choices = Choice::all();
        return response()->json($choices);
    }
}

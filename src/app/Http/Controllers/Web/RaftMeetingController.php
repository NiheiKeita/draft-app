<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RaftMeetingController extends Controller
{
    public function index()
    {
        return view('raft-meeting.index');
    }
}

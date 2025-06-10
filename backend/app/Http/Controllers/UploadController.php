<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        if ($request->hasFile('file')) {
            $uploadedFileUrl = Cloudinary::upload($request->file('file')->getRealPath())->getSecurePath();
            return response()->json(['url' => $uploadedFileUrl]);
        }

        return response()->json(['error' => 'No file uploaded'], 400);
    }
}

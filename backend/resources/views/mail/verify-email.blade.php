<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email Address</title>
    @vite('resources/css/app.css')
</head>
<body class="bg-gray-100">
<div class="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden my-10">
    <div class="bg-custom-green text-white text-center py-4">
        <h1 class="text-3xl font-bold">Verify Your Email Address</h1>
    </div>
    <div class="p-6">
        <h2 class="text-2xl font-semibold text-gray-800">Hello, {{ $name }}!</h2>
        <p class="mt-4 text-gray-600 mb-4">Thank you for registering with Штоп. Please verify your email address by clicking the button below.</p>
        <a href="{{ $url }}"><span class="mt-4 bg-custom-green text-white font-semibold p-3 rounded-xl">Verify Email Address</span></a>
        <p class="mt-4 text-gray-600">If you did not create an account, no further action is required.</p>
        <p class="mt-4 text-gray-600">If you’re having trouble clicking the "Verify Email Address" button, copy and paste the URL below into your web browser:</p>
        <a href="{{ $url }}" class="text-custom-green break-words">{{ $url }}</a>
        <p class="mt-6 text-gray-800">Best regards,</p>
        <p class="text-gray-800 font-semibold">The Штоп Team</p>
    </div>
    <div class="bg-gray-200 text-center py-4">
        <p class="text-gray-600">© 2024 Штоп. All rights reserved.</p>
    </div>
</div>
</body>
</html>

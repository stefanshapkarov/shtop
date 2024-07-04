<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Штоп</title>
    @vite('resources/css/app.css')
</head>
<body class="bg-gray-100">
<div class="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden my-10">
    <div class="bg-custom-green text-white text-center py-4 ">
        <h1 class="text-3xl font-bold">Welcome to Штоп!</h1>
    </div>
    <div class="p-6">
        <h2 class="text-3xl font-semibold text-gray-800">Hello, {{ $name }}!</h2>
        <p class="mt-4 text-gray-600">Thank you for joining Штоп, your new ride-sharing companion. We are thrilled to have you on board.</p>
        <p class="mt-4 text-gray-600">Here are some things you can do next:</p>
        <ul class="mt-4 list-disc list-inside text-gray-600">
            <li>Complete your profile to get personalized ride recommendations.</li>
            <li>Check out the available rides and book your first trip.</li>
            <li>Invite your friends to join and earn rewards.</li>
        </ul>
        <p class="mt-4 text-gray-600">If you have any questions or need assistance, feel free to reach out to our support team.</p>
        <p class="mt-4 text-gray-600">Happy riding!</p>
        <p class="mt-6 text-gray-800">Best regards,</p>
        <p class="text-gray-800 font-semibold">The Штоп Team</p>
    </div>
    <div class="bg-gray-200 text-center py-4">
        <p class="text-gray-600">© 2024 Штоп. All rights reserved.</p>
    </div>
</div>
</body>
</html>

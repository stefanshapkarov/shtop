<?php

namespace App\Notifications;

use App\Models\RidePost;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RideRequestAccepted extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private RidePost $ridePost){}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        // TODO: Set url to view of the ride post
//        $url = url('api/ridePost/' . $this->ridePost->id);

        return (new MailMessage)
            ->greeting('Dear ' . $notifiable->name)
            ->line('Your request to be part of the ride at ' . $this->ridePost->departure_time .
            ' to ' . $this->ridePost->destination_city . ' has been accepted.')
//            ->action('View Ride', $url)
            ->line('Thank you for using SHTOP.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}

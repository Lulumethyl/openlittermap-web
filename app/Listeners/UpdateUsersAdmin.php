<?php

namespace App\Listeners;

use App\Models\User\User;
use App\Models\Photo;
use App\Events\PhotoVerifiedByAdmin;
use App\Events\DynamicUpdate;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class UpdateUsersAdmin
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  DynamicUpdate  $event
     * @return void
     */
    public function handle (PhotoVerifiedByAdmin $event)
    {
        $photoId = $event->photoId;
        $photo = Photo::find($photoId);
        $user = User::find($photo->user_id);

        if ($user->count_correctly_verified == 100)
        {
            $user->littercoin_allowance += 1;
            $user->count_correctly_verified = 0;
        }
        $user->count_correctly_verified += 1;

        // TODO :
        // Update total column on Photos for each Category on this photo

        $userPhotos = $user->photos()->where('verified', '>=', 1)->get();
        $user->total_verified = $userPhotos->count();

        $totalVerifiedLitter = 0;
        foreach($userPhotos as $userPhoto)
        {
            if ($userPhoto["total_smoking"]) {
                $totalVerifiedLitter += $userPhoto["total_smoking"];
            }
            if ($userPhoto["total_alcohol"]) {
                $totalVerifiedLitter += $userPhoto["total_alcohol"];
            }
            if ($userPhoto["total_coffee"]) {
                $totalVerifiedLitter += $userPhoto["total_coffee"];
            }
            if ($userPhoto["total_food"]) {
                $totalVerifiedLitter += $userPhoto["total_food"];
            }
            if ($userPhoto["total_softDrinks"]) {
                $totalVerifiedLitter += $userPhoto["total_softDrinks"];
            }
            if ($userPhoto["total_drugs"]) {
                $totalVerifiedLitter += $userPhoto["total_drugs"];
            }
            if ($userPhoto["total_sanitary"]) {
                $totalVerifiedLitter += $userPhoto["total_sanitary"];
            }
            if ($userPhoto["total_other"]) {
                $totalVerifiedLitter += $userPhoto["total_other"];
            }
            if ($userPhoto["total_coastal"]) {
                $totalVerifiedLitter += $userPhoto["total_coastal"];
            }
            if ($userPhoto["total_pathways"]) {
                $totalVerifiedLitter += $userPhoto["total_pathways"];
            }
        }

        $user->total_verified_litter = $totalVerifiedLitter;
        $user->save();
    }
}

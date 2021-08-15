//----------------------------------//
///// VenoX Gaming & Fun 2021 © ///////
//////By Solid_Snake & VnX RL Crew////
//////www.venox-international.com//////
//----------------------------------//

import * as alt from 'alt-client';
import weaponData from './weapon-data';

export function getAllPlayerWeapons(player: alt.Player): number[] {
    let weaponSlotsMap = [];
    for (var key in weaponData)
        if (player.getStreamSyncedMeta(key))
            weaponSlotsMap.push(key)
    return weaponSlotsMap;
}
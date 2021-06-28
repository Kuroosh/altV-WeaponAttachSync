//----------------------------------//
///// VenoX Gaming & Fun 2021 © ///////
//////By Solid_Snake & VnX RL Crew////
//////www.venox-international.com//////
//----------------------------------//

import * as alt from 'alt-client';
import * as game from 'natives';


const weaponSlots = [1993361168, 1277010230, 932043479, 690654591, 1459198205, 195782970, -438797331, 896793492, 495159329, -1155528315, -515636489, -871913299, -1352759032, -542958961, 1682645887, -859470162, -2125426402, 2067210266, -538172856, 1783244476, 439844898, -24829327, 1949306232, -1941230881, -1033554448, 320513715, -695165975, -281028447, -686713772, 347509793, 1769089473, 189935548, 248801358, 386596758, -157212362, 436985596, -47957369, 575938238];
export function getWeaponTypeInSlot(player: alt.Player, weaponSlot: number): number {
    return game.getPedWeapontypeInSlot(player.scriptID, weaponSlot);
}
export function getAllPlayerWeapons(player: alt.Player): number[] {
    return weaponSlots.map(weaponSlot => getWeaponTypeInSlot(player, weaponSlot)).filter(weapon => !!weapon);
}


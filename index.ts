//----------------------------------//
///// VenoX Gaming & Fun 2021 © ///////
//////By Solid_Snake & VnX RL Crew////
//////www.venox-international.com//////
//----------------------------------//

import * as alt from 'alt-client';
import * as game from 'natives';
import bodyAttachData from './body-attach-data';
import weaponData from './weapon-data';
import { getAllPlayerWeapons } from './weapon-helper';


/* Settings */
const UpdateIntervalWeapon = 500;


/* Variables */
const playerEntrys = {};
const nearbyPlayers = {};
const localPlayer = alt.Player.local;


function createPlayerEntryIfNeeded(player: alt.Player) {
    if (playerEntrys[player.id]) return;
    playerEntrys[player.id] = {
        Id: player.id,
        Weapons: getAllPlayerWeapons(player),
        Objects: {}
    };
}

function createPlayerObjects(player: alt.Player) {
    if (!playerEntrys[player.id]) return;
    for (const weapon of playerEntrys[player.id].Weapons) {
        if (player.currentWeapon == weapon) {
            destroyPlayerObjectByHash(player, weapon);
            continue;
        }

        if (playerEntrys[player.id].Objects[weapon]) continue;

        let currentWeaponData = weaponData[String(weapon)];
        if (!bodyAttachData[currentWeaponData.HashKey]) continue;

        let hash = game.getHashKey(currentWeaponData.ModelHashKey);
        if (!game.hasModelLoaded(hash))
            game.requestModel(hash);

        /* Create object */
        let obj = game.createObjectNoOffset(hash, player.pos.x, player.pos.y, player.pos.z, false, false, false);
        /* Needed variables */
        let attachBone = bodyAttachData[currentWeaponData.HashKey].AttachBone;
        let attachPos = bodyAttachData[currentWeaponData.HashKey].AttachPosition;
        let attachRot = bodyAttachData[currentWeaponData.HashKey].AttachRotation;

        /* Attach object to entity */
        game.attachEntityToEntity(obj, player.scriptID, game.getPedBoneIndex(player.scriptID, attachBone), attachPos.x, attachPos.y, attachPos.z, attachRot.x, attachRot.y, attachRot.z, true, true, false, false, 0, true);

        /* Cache it into playerEntrys */
        playerEntrys[player.id].Objects[weapon] = obj;
    }

}

function destroyPlayerObjects(player: alt.Player) {
    if (!playerEntrys[player.id]) return;
    for (const obj of Object.values(playerEntrys[player.id].Objects) as number[])
        game.deleteObject(obj);

    delete playerEntrys[player.id];
}

function destroyPlayerObjectByHash(player: alt.Player, hash: number) {
    if (!playerEntrys[player.id] || !playerEntrys[player.id].Objects[hash]) return;
    game.deleteObject(playerEntrys[player.id].Objects[hash]);
    playerEntrys[player.id].Objects[hash] = null;
}



alt.on("gameEntityCreate", entity => {
    if (!(entity instanceof alt.Player)) return;
    nearbyPlayers[entity.id] = entity;
});

alt.on("gameEntityDestroy", entity => {
    if (!(entity instanceof alt.Player)) return;
    destroyPlayerObjects(entity);
    delete nearbyPlayers[entity.id];
});

alt.on('streamSyncedMetaChange', (entity: alt.BaseObject, key: string, val: Object, oldVal: Object) => {
    if (!(entity instanceof alt.Player)) return;
    if (weaponSlots.includes(parseInt(key))) {
        destroyPlayerObjects(entity);
        delete nearbyPlayers[entity.id];
    }
});




alt.setInterval(() => {
    const allPlayers = nearbyPlayers;
    for (const player of Object.values(allPlayers) as alt.Player[]) {
        createPlayerEntryIfNeeded(player);
        createPlayerObjects(player);
    }

    /* Local player */
    createPlayerEntryIfNeeded(localPlayer);
    createPlayerObjects(localPlayer);
}, UpdateIntervalWeapon);
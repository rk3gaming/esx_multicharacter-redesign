Menu = {}
Menu._index = Menu
Menu.currentElements = {}

function Menu:OpenMenu()
    SendNUIMessage({
        type = 'showUI',
        characters = self.currentElements,
        slots = Multicharacter.slots,
        canDelete = Config.CanDelete
    })
end

function Menu:Close()
    self.currentElements = {}
    SendNUIMessage({
        type = 'hideUI'
    })
end

function Menu:CheckModel(character)
    if not character.model and character.skin then
        if character.skin.model then
            character.model = character.skin.model
        elseif character.skin.sex == 1 then
            character.model = `mp_f_freemode_01`
        else
            character.model = `mp_m_freemode_01`
        end
    end
end

function Menu:AddCharacters()
    self.currentElements = {}
    
    for _, v in pairs(Multicharacter.Characters) do
        self:CheckModel(v)
        local label = ("%s %s"):format(v.firstname, v.lastname)
        self.currentElements[#self.currentElements + 1] = { 
            title = label,
            value = v.id,
            disabled = v.disabled or false
        }
    end
    
    while #self.currentElements < Multicharacter.slots do
        self.currentElements[#self.currentElements + 1] = { 
            title = TranslateCap("create_char"),
            value = (#self.currentElements + 1),
            new = true
        }
    end
end

local GetSlot = function()
    for i = 1, Multicharacter.slots do
        if not Multicharacter.Characters[i] then
            return i
        end
    end
end

function Menu:NewCharacter()
    self:Close()
    local slot = GetSlot()

    TriggerServerEvent("esx_multicharacter:CharacterChosen", slot, true)
    TriggerEvent("esx_identity:showRegisterIdentity")

    local playerPed = PlayerPedId()

    SetPedAoBlobRendering(playerPed, false)
    SetEntityAlpha(playerPed, 0, false)

    Multicharacter:CloseUI()
end

function Menu:SelectCharacter()
    local Characters = Multicharacter.Characters
    local Character = next(Characters)
    self:CheckModel(Characters[Character])

    if not Multicharacter.spawned then
        Multicharacter:SetupCharacter(Character)
    end

    self.currentElements = {}
    
    self:AddCharacters()
    
    self.onUse = function(_, SelectedCharacter)
        if SelectedCharacter.new then
           self:NewCharacter()
        else
            if SelectedCharacter.value ~= Multicharacter.spawned then
                Multicharacter:SetupCharacter(SelectedCharacter.value)
                local playerPed = PlayerPedId()
                SetPedAoBlobRendering(playerPed, true)
                ResetEntityAlpha(playerPed)
            end
            self:CharacterOptions()
        end
    end

    self:OpenMenu()
end

function Menu:CharacterOptions()
    local currentCharacter = Multicharacter.Characters[Multicharacter.spawned]
    local elements = {
        {
            title = TranslateCap("character", currentCharacter.firstname .. " " .. currentCharacter.lastname),
            icon = "fa-regular fa-user",
            unselectable = true
        },
        {
            title = TranslateCap("return"),
            unselectable = false,
            icon = "fa-solid fa-arrow-left",
            description = TranslateCap("return_description"),
            action = "return"
        },
    }

    if not currentCharacter.disabled then
        elements[3] = {
            title = TranslateCap("char_play"),
            description = TranslateCap("char_play_description"),
            icon = "fa-solid fa-play",
            action = "play",
        }
    else
        elements[3] = {
            title = TranslateCap("char_disabled"),
            icon = "fa-solid fa-xmark",
            description = TranslateCap("char_disabled_description")
        }
    end
    if Config.CanDelete then
        elements[4] = {
            title = TranslateCap("char_delete"),
            icon = "fa-solid fa-xmark",
            description = TranslateCap("char_delete_description"),
            action = "delete",
        }
    end

    self.currentElements = elements
    self.onUse = function(_, Action)
        if Action.action == "play" then
            Multicharacter:CloseUI()
            self:Close()

            TriggerServerEvent("esx_multicharacter:CharacterChosen", Multicharacter.spawned, false)
        elseif Action.action == "delete" then
            self:ConfirmDeletion()
        elseif Action.action == "return" then
            self:SelectCharacter()
        end
    end

    self:OpenMenu()
end

function Menu:ConfirmDeletion()
    self.currentElements = {
        {
            title = TranslateCap("char_delete_confirmation"),
            icon = "fa-solid fa-users",
            description = TranslateCap("char_delete_confirmation_description"),
            unselectable = true
        },
        {
            title = TranslateCap("char_delete"),
            icon = "fa-solid fa-xmark",
            description = TranslateCap("char_delete_yes_description"),
            action = "delete",
        },
        {
            title = TranslateCap("return"),
            unselectable = false,
            icon = "fa-solid fa-arrow-left",
            description = TranslateCap("char_delete_no_description"),
            action = "return"
        },
    }

    self.onUse = function(_, Action)
        if Action.action == "delete" then
            self:Close()

            TriggerServerEvent("esx_multicharacter:DeleteCharacter", Multicharacter.spawned)
            Multicharacter.spawned = false
            self:SelectCharacter()
        elseif Action.action == "return" then
            self:CharacterOptions()
        end
    end

    self:OpenMenu()
end

RegisterNUICallback('previewCharacter', function(data, cb)
    if data.characterId then
        local character = Multicharacter.Characters[data.characterId]
        if character and character.skin then
            TriggerEvent("skinchanger:loadSkin", character.skin)
        end
    end
    cb({})
end)

RegisterNUICallback('selectCharacter', function(data, cb)
    if data.characterId then
        Multicharacter:CloseUI()
        Menu:Close()
        TriggerServerEvent("esx_multicharacter:CharacterChosen", data.characterId, false)
    end
    cb({})
end)

RegisterNUICallback('deleteCharacter', function(data, cb)
    if data.characterId then
        Menu:Close()
        TriggerServerEvent("esx_multicharacter:DeleteCharacter", data.characterId)
        Multicharacter.spawned = false
        Wait(500) 
        
        local hasCharacters = false
        for _ in pairs(Multicharacter.Characters) do
            hasCharacters = true
            break
        end
        
        if not hasCharacters then
            local slot = GetSlot()
            TriggerServerEvent("esx_multicharacter:CharacterChosen", slot, true)
            TriggerEvent("esx_identity:showRegisterIdentity")
            
            local playerPed = PlayerPedId()
            SetPedAoBlobRendering(playerPed, false)
            SetEntityAlpha(playerPed, 0, false)
            
            Multicharacter:CloseUI()
        else
            Menu:AddCharacters()
            Menu:OpenMenu()
        end
    end
    cb({})
end)

RegisterNUICallback('createCharacter', function(data, cb)
    Menu:NewCharacter()
    cb({})
end)
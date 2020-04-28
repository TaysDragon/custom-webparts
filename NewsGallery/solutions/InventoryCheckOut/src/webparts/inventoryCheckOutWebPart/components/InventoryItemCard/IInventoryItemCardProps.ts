// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { IInventoryItem } from "../../models/InventoryCheckOutModel";

interface IInventoryItemCardProps {
    item:IInventoryItem;
    onClickEvent:any;
}

export default IInventoryItemCardProps;
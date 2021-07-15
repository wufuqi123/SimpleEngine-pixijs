import { UUIDUtils } from "../utils/UUIDUtils";

export class HashObject{
    public hashCode():number|string{
        return UUIDUtils.getUUID();
    }
}
import { utils } from "pixi.js";

/**
 * android设备
 */
interface AndroidMobile {
    /**
     * 如果为true  则是任何android设备
     */
    device: boolean;
    /**
     * 如果为true  则是任何Android手机
     */
    phone: boolean; 
    /**
     * 如果为true  则是任何Android平板电脑
     */
    tablet: boolean; 
}

/**
 * 苹果设备信息
 */
interface AppleMobile{
    /**
     * 是否是  苹果  设备
     */
    device:boolean;
    /**
     * 是否是苹果的ipod设备
     */
    ipod:boolean;
    /**
     * 是否是苹果的手机设备
     */
    phone:boolean;
    /**
     * 是否是苹果的 iPad 设备
     */
    tablet:boolean;
}

/**
 * 亚马逊设备
 */
interface AmazonMobile{
    /**
     * 是否是  亚马逊  设备
     */
    device:boolean;
    /**
     * 是否是亚马逊的手机设备
     */
    phone:boolean;
    /**
     * 是否是亚马逊的 iPad 设备
     */
    tablet:boolean;
}
/**
 * Windows设备
 */
interface WindowsMobile{
    /**
     * 是否是  Windows  设备
     */
    device:boolean;
    /**
     * 是否是Windows的手机设备
     */
    phone:boolean;
    /**
     * 是否是Windows的 iPad 设备
     */
    tablet:boolean;
}


/**
 * 用来检测是否是移动设备的工具类
 */
export class MobileUtils {

    /**
     * 是否是移动设备
     * 手机  或  平板
     */
    public static get isMobile(): boolean { return utils.isMobile.any; };
    /**
     * 是否为任何手机设备
     */
    public static get phone():boolean{ return utils.isMobile.phone;}

    /**
     * 是否为任何平板设备
     */
    public static get tablet():boolean{ return utils.isMobile.tablet;}
    /**
     * android设备的相关信息
     * 
     */
    public static get android(): AndroidMobile {
        let phone = false;
        let tablet = false;
        let device = false;
        let android = utils.isMobile.android;
        if (android) {
            phone = android.phone;
            tablet = android.tablet;
            device = android.device;
        }
        return {
            phone,
            tablet,
            device
        }
    }

    /**
     * 是否是苹果设备
     */
    public static get apple():AppleMobile {
        let phone = false;
        let tablet = false;
        let ipod = false;
        let device = false;
        let apple = utils.isMobile.apple;
        if (apple) {
            phone = apple.phone;
            tablet = apple.tablet;
            device = apple.device;
            ipod = apple.ipod;
        }
        return {
            phone,
            ipod,
            tablet,
            device
        }
    }

    /**
     * 是否是亚马逊设备
     */
    public static get amazon():AmazonMobile{
        let phone = false;
        let tablet = false;
        let device = false;
        let amazon = utils.isMobile.amazon;
        if (amazon) {
            phone = amazon.phone;
            tablet = amazon.tablet;
            device = amazon.device;
        }
        return {
            phone,
            tablet,
            device
        }
    }

    /**
     * 是否是windows设备
     */
    public static get windows():WindowsMobile{
        let phone = false;
        let tablet = false;
        let device = false;
        let windows = utils.isMobile.windows;
        if (windows) {
            phone = windows.phone;
            tablet = windows.tablet;
            device = windows.device;
        }
        return {
            phone,
            tablet,
            device
        }
    }
    

}
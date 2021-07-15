// import "./PixiPatches";
import "./utils/base-extensions";
import "./core/PixiPatches";

export { GameApplication } from "./core/GameApplication";
export { Mediator, mediate, action } from "./core/Mediator";
export { PlayerPrefs } from "./core/PlayerPrefs";
//资源管理器
export { ResManager } from "./core/ResManager";
//游戏场景
export { SceneManager } from "./core/SceneManager";
export { GameManager } from "./core/GameManager";
export { GameScene } from "./core/GameScene";
//元素
export { Component } from "./core/Component";
//对象池
export { ObjectPool } from "./core/ObjectPool";
//gui
export { GameTexture } from "./gui/GameTexture";
export { MultistateSprite } from "./gui/MultistateSprite";
export { MultistateComponent } from "./gui/components/MultistateComponent";
export { Image } from "./gui/components/Image";
export { Dialog } from "./gui/components/Dialog";
export { DialogEventCallback } from "./gui/components/Dialog";
export { Canvas } from "./gui/components/Canvas";
export { Layout } from "./gui/components/Layout";
export { Button } from "./gui/components/Button";
export { CheckBox } from "./gui/components/CheckBox";
export { Radio } from "./gui/components/Radio";
export { RadioResist } from "./gui/components/RadioResist";
export { RadioResistType } from "./gui/components/RadioResist";
export { RadioGroup } from "./gui/components/RadioGroup";
export { ProgressBar } from "./gui/components/ProgressBar";
export { MaskProgressBar } from "./gui/components/MaskProgressBar";
export { Slider } from "./gui/components/Slider";
export { Switch } from "./gui/components/Switch";
export { SwitchText } from "./gui/components/SwitchText";
export { Scroller } from "./gui/components/Scroller";
export { ScrollBar } from "./gui/components/ScrollBar";
export { List } from "./gui/components/List";
export { Pager } from "./gui/components/Pager";
export { EditText } from "./gui/components/EditText";
export { RichText } from "./gui/components/RichText";
export { Label } from "./gui/components/Label";
export { SpineNative } from "./gui/components/SpineNative";
export { Spine } from "./gui/components/Spine";
export { PlaneImage } from "./gui/components/PlaneImage";
export { Particles } from "./gui/components/Particles";
export { BitmapLabel } from "./gui/components/BitmapLabel";
export { AdapterContainer } from "./gui/components/AdapterContainer";
export { Toast } from "./gui/components/Toast";
export { Table } from "./gui/components/Table";
export { BaseListAdapter } from "./gui/adapter/BaseListAdapter";
export { ListAdapter } from "./gui/adapter/ListAdapter";
export { PageAdapter } from "./gui/adapter/PageAdapter";
export { PageClassAdapter } from "./gui/adapter/PageClassAdapter";

export { RichTextParse } from "./gui/utils/RichTextParse";
export { ScalePagerPlug } from "./gui/plug/pager/ScalePagerPlug";

//事件
export { EventManager } from "./event/EventManager";
export { InteractionEvent } from "./event/EventManager";
//计时器
export { Timer } from "./timer/Timer";
//工具
export { ClassUtils } from "./utils/ClassUtils";
export { Zip } from "./utils/Zip";
export { DateFormat } from "./utils/DateFormat";
export { CircleUtils } from "./utils/CircleUtils";
export { Base64Utlis } from "./utils/Base64Utlis";
export { ScreenShotUtils } from "./utils/ScreenShotUtils";
export { Random } from "./utils/Random";
export { TextUtils } from "./utils/TextUtils";
export { UUIDUtils } from "./utils/UUIDUtils";
export { ColorUtils } from "./utils/ColorUtils";
export { CallbackHelper } from "./utils/CallbackHelper";
export { BlendModes } from "./utils/BlendModes";
export { EventPoint } from "./gui/utils/EventPoint";

export { ResLoadGroupManager } from "./res/ResLoadGroupManager";
export { ResDestroyArray } from "./res/ResDestroyArray";
export { GameResManager } from "./res/GameResManager";

//对话
export { TweenManager } from "./tween/TweenManager";
export { Tween } from "./tween/Tween";
export { Easing } from "./tween/Easing";
//视频
export { VideoComponent } from "./video/VideoComponent";
export { VideoUI } from "./video/VideoUI";
export { VideoManager } from "./video/VideoManager";
//声音
export { HTMLAudioManager } from "./audio/html/HTMLAudioManager";
export { HTMLAudio } from "./audio/html/HTMLAudio";
export { AudioGroupInterface } from "./audio/interface/AudioGroupInterface";
export { AudioInterface } from "./audio/interface/AudioInterface";
export { AudioComponent } from "./audio/AudioComponent";
export { AudioManager } from "./audio/AudioManager";
export { AudioType } from "./audio/AudioType";
export { AudioGroupManager } from "./audio/AudioGroupManager";
//打印
export { Log } from "./log/Log";

export { Action } from "./animation/Action";
export { ActionSet } from "./animation/ActionSet";
//多线程
export { Thread } from "./thread/Thread";

// Filter
export { AlphaFilter } from "./filters/AlphaFilter";
export { BlurFilter } from "./filters/BlurFilter";
export { DissolveFilter } from "./filters/DissolveFilter";
export { DynamicBlurTransferFilter } from "./filters/DynamicBlurTransferFilter";
export { FlickerFilter } from "./filters/FlickerFilter";
export { FluxayFilter } from "./filters/FluxayFilter";
export { FluxaySuperFilter } from "./filters/FluxaySuperFilter";
export { GaussBlursFilter } from "./filters/GaussBlursFilter";
export { MaskFilter } from "./filters/MaskFilter";
export { MosaicFilter } from "./filters/MosaicFilter";
export { RadialBlurFilter } from "./filters/RadialBlurFilter";
export { RainFilter } from "./filters/RainFilter";
export { UnfoldTransferFilter } from "./filters/UnfoldTransferFilter";
export { WaterFilter } from "./filters/WaterFilter";
export { WaveFilter } from "./filters/WaveFilter";
export { WatermarkFilter } from "./filters/WatermarkFilter";
export { WindowTransferFilter } from "./filters/WindowTransferFilter";
export { ZoomBlurTransferFilter } from "./filters/ZoomBlurTransferFilter";
export { BesmirchFilter } from "./filters/BesmirchFilter";
export { AlphaMaskFilter } from "./filters/AlphaMaskFilter";
export { ColorFillFilter } from "./filters/ColorFillFilter";

export { PathUtils } from "./utils/PathUtils";
export { ScriptUtils } from "./utils/ScriptUtils";
export { MobileUtils } from "./utils/MobileUtils";

export { Audio } from "./audio/Audio";
export { Bgm } from "./audio/Bgm";
export { Sound } from "./audio/Sound";
export { Voice } from "./audio/Voice";
export { HashObject } from "./api/HashObject";
export { HashMap } from "./api/HashMap";

export { ComponentCollider } from "./collider/ComponentCollider";
export { RectangleCollider } from "./collider/RectangleCollider";
export { CircleColloder } from "./collider/CircleColloder";
export { PonlygonCollider } from "./collider/PonlygonCollider";
export { BaseCollider } from "./collider/BaseCollider";
export { ColliderData } from "./collider/ColliderData";
export { ColliderGroup } from "./collider/ColliderGroup";
export { ColliderGroupManager } from "./collider/ColliderGroupManager";
export { ColliderManager } from "./collider/ColliderManager";


export { SaxParse } from "./fInterpreter/SaxParse";
export { PlistParser } from "./fInterpreter/PlistParser";

/**
 * 敏感字
 */
export { SensitiveWord } from "./sensitiveWord/SensitiveWord";



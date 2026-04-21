import { AudioClip, AudioSource, Button, Node } from 'cc';
import GM from '../GM';
export default class AudioMgr {
  private static _inst: AudioMgr;
  public static getInstance(): AudioMgr {
    if (this._inst == null) {
      this._inst = new AudioMgr();
    }
    return this._inst;
  }
  private _audioSource: AudioSource;
  private _effectSource: AudioSource;
  private _loopEffects: Map<string, AudioSource> = new Map();
  private _clipCache: Map<string, AudioClip> = new Map();

  private count = 0;

  //音频资源
  public readonly AudioData = {
    BGM: 'Audio/UI/背景音乐',
    FightBGM: 'SoundRes/UI/游戏背景音乐',
    CLICK: 'music/buttonclick',
    DIGBEGIN: 'music/digging',
    DIGEND: 'music/getcard',
    SELL: 'music/sellcard',
    ATTACK: 'music/niandanClick',//念弹点击
    BALLCOLLIDER: 'Audio/Game/球球碰撞',//球碰撞
    BUTTONCLICK: 'Audio/UI/按钮'//按钮点击
  }

  constructor() { }

  Init(mainNode: Node) {
    let audioMgr = new Node();
    audioMgr.name = 'AudioMgr';
    audioMgr.parent = mainNode;
    this._audioSource = audioMgr.addComponent(AudioSource);

    let effectMgr = new Node();
    effectMgr.name = 'EffectMgr';
    effectMgr.parent = audioMgr;
    this._effectSource = effectMgr.addComponent(AudioSource);
  }

  public get audioSource() {
    return this._audioSource;
  }
  public get effectSource() {
    return this._effectSource;
  }

  /**
   * 播放循环音效
   * @param sound 音频资源
   * @param volume 音量
   */
  playLoopEffect(sound: AudioClip | string, volume: number = this.EffectVolume): string {
    const instanceId = Date.now().toString();
    const audioSource = this._effectSource.node.addComponent(AudioSource);
    this._loopEffects.set(instanceId, audioSource);
    if (sound instanceof AudioClip) {
      audioSource.clip = sound;
      audioSource.loop = true;
      audioSource.volume = volume;
      audioSource.play();
    } else {
      GM.ResMgr.Res.load(sound, (err, clip: AudioClip) => {
        if (err) {
          console.log(err);
        } else {
          audioSource.clip = clip;
          audioSource.loop = true;
          audioSource.volume = volume;
          audioSource.play();
        }
      });
    }
    return instanceId;
  }

  /**
   * 停止循环音效
   * @param key 音效唯一标识
   */
  stopLoopEffect(instanceId: string) {
    // 停止指定音效实例
    const audioSource = this._loopEffects.get(instanceId);
    if (audioSource) {
      audioSource.stop();
      this._loopEffects.delete(instanceId);
    }
  }

  private EffectVolume = 1;
  private _BgmVolume = 1;
  public get BgmVolume() {
    return this._BgmVolume;
  }
  public setEffectVolume(volume: number) {
    this.EffectVolume = volume;
    this._loopEffects.forEach(audioSource => {
      audioSource.volume = volume;
    })
  }
  public setBgmVolume(volume: number) {
    this._BgmVolume = volume;
    if (volume == 0) {
      this.pause();
    } else {
      this.resume();
    }
  }

  /**
   * @zh
   * 播放短音频,比如 打击音效，爆炸音效等
   * @param sound clip or url for the audio
   * @param volume 
   */
  playOneShot(sound: AudioClip | string, volume: number = this.EffectVolume) {
    if (sound instanceof AudioClip) {
      this._effectSource.playOneShot(sound, volume);
    }
    else {
      if (this._clipCache.has(sound)) {
        this._effectSource.playOneShot(this._clipCache.get(sound)!, volume);
        return;
      }
      GM.ResMgr.Res.load(sound, (err, clip: AudioClip) => {
        if (err) {
          console.log(err);
        }
        else {
          this._clipCache.set(sound, clip);
          this._effectSource.playOneShot(clip, volume);
        }
      });
    }
  }

  /**
   * @zh
   * 播放长音频，比如 背景音乐
   * @param sound clip or url for the sound
   * @param volume 
   */
  play(sound: AudioClip | string, loop = true, volume: number = this._BgmVolume) {
    this._audioSource.stop();
    if (sound instanceof AudioClip) {
      this._audioSource.clip = sound;
      this.audioSource.volume = volume;
      this.audioSource.loop = loop;
      if (this._BgmVolume > 0) {
        this._audioSource.play();
      }
    }
    else {
      GM.ResMgr.Res.load(sound, (err, clip: AudioClip) => {
        if (err) {
          console.log(err);
        }
        else {
          this._audioSource.clip = clip;
          this.audioSource.volume = volume;
          this.audioSource.loop = loop;
          if (this._BgmVolume > 0) {
            this._audioSource.play();
          }
        }
      });
    }
  }

  stop() {
    console.log('AudioMgr.stop');
    this._audioSource.stop();
  }

  pause() {
    this._audioSource.pause();
  }

  resume() {
    this.audioSource.volume = this._BgmVolume;
    this._audioSource.play();
  }

  /**设置按钮点击音效 */
  SetButtonSound(): void {

    if (Button.prototype["touchBeganClone"]) return;

    Button.prototype["touchBeganClone"] = Button.prototype["_onTouchEnded"];

    Button.prototype["_onTouchEnded"] = function (event) {

      if (this.interactable && this.enabledInHierarchy) {

        // 播放自己的按钮音效
        GM.AudioMgr.playOneShot(GM.AudioMgr.AudioData.BUTTONCLICK);
        // if (GM.AudioMgr.count == 0) {
        //   GM.Network.SendMsg(13600, { type: 0 }, (proto: number, data: any) => {
        //     GM.AudioMgr.count++;
        //   }, this, { repeat: true });
        // }

        // ......
      }

      this.touchBeganClone(event);

    }

  }
}
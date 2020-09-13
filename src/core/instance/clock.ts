import { Clock, JulianDate, ClockRange, ClockStep } from 'cesium'

export function initClock (cm) {
    let timer = Object.create(cm)
    timer = (<any>Object).assign(timer, {
        setClock,
        resetCurrentTime,
        doubleTimeRateUp,
        doubleTimeRateUpDown
    })

    cm.timer = timer
}

// 设置时间配置接口
interface SetClockOpt {
    clockStep: number,
    clockRange: number,
    multiplier: number,
    shouldAnimate: boolean,
}

// 设置时间（初始化）
export function setClock(startTime: string, endTime: string, currentTime: string, option?:SetClockOpt):object {
    let { clockRange, clockStep, multiplier, shouldAnimate } = option
    // 初始化时间
    const clock = new Clock({
        startTime: JulianDate.fromIso8601(startTime), // 时钟开始时间
        currentTime: JulianDate.fromIso8601(currentTime), // 时钟当前时间
        stopTime: JulianDate.fromIso8601(endTime), // 时钟停止时间
        // ClockRange用于控制时间结束后的行为，LOOP_STOP：当到达结束时间时进行循环，
        // UNBOUNDED：时间无限下去，不受控制，CLAMPED：到达停止时间后停止运行
        clockRange: clockRange || ClockRange.LOOP_STOP,
        // ClockStep用于设置时间的速率，SYSTEM_CLOCK_MULTIPLIER：正常系统时间速度的两倍，SYSTEM_CLOCK：当前系统时间，TICK_DEPENDENT：指定倍数
        clockStep: clockStep || ClockStep.SYSTEM_CLOCK_MULTIPLIER,
        multiplier: multiplier || 4000, // 每一次提升需要多少时间
        shouldAnimate: true, // 默认开启动画
    })
    return clock
}

function resetCurrentTime () {
    let resetTime = this.viewer.clockViewModel.startTime
    this.viewer.clockViewModel.currentTime = resetTime
     this.viewer.timeline.updateFromClock()
}



function doubleTimeRateUp () {
    this.viewer.clockViewModel.multiplier /= 2
}

function doubleTimeRateUpDown () {
    this.viewer.clockViewModel.multiplier *= 2;
  }
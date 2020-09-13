define(["require", "exports", "cesium"], function (require, exports, cesium_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setClock = exports.initClock = void 0;
    function initClock(cm) {
        let timer = Object.create(cm);
        timer = Object.assign(timer, {
            setClock,
            resetCurrentTime,
            doubleTimeRateUp,
            doubleTimeRateUpDown
        });
        cm.timer = timer;
    }
    exports.initClock = initClock;
    // 设置时间（初始化）
    function setClock(startTime, endTime, currentTime, option) {
        let { clockRange, clockStep, multiplier, shouldAnimate } = option;
        // 初始化时间
        const clock = new cesium_1.Clock({
            startTime: cesium_1.JulianDate.fromIso8601(startTime),
            currentTime: cesium_1.JulianDate.fromIso8601(currentTime),
            stopTime: cesium_1.JulianDate.fromIso8601(endTime),
            // ClockRange用于控制时间结束后的行为，LOOP_STOP：当到达结束时间时进行循环，
            // UNBOUNDED：时间无限下去，不受控制，CLAMPED：到达停止时间后停止运行
            clockRange: clockRange || cesium_1.ClockRange.LOOP_STOP,
            // ClockStep用于设置时间的速率，SYSTEM_CLOCK_MULTIPLIER：正常系统时间速度的两倍，SYSTEM_CLOCK：当前系统时间，TICK_DEPENDENT：指定倍数
            clockStep: clockStep || cesium_1.ClockStep.SYSTEM_CLOCK_MULTIPLIER,
            multiplier: multiplier || 4000,
            shouldAnimate: true,
        });
        return clock;
    }
    exports.setClock = setClock;
    function resetCurrentTime() {
        let resetTime = this.viewer.clockViewModel.startTime;
        this.viewer.clockViewModel.currentTime = resetTime;
        this.viewer.timeline.updateFromClock();
    }
    function doubleTimeRateUp() {
        this.viewer.clockViewModel.multiplier /= 2;
    }
    function doubleTimeRateUpDown() {
        this.viewer.clockViewModel.multiplier *= 2;
    }
});

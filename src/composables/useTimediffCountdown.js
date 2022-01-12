import { ref } from 'vue'
import moment from 'moment'
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()
export default function useTimediffCountdown() {
    const remainTime = ref('')
    let remainTimer
    function format(num) {
        return num > 9 ? num : ('0' + num)
    }
    const startCountDown = () => {
        clearRemainTimer()
        let startTime = new Date('2021/11/22 00:00:00').getTime()
        let endTime = new Date('2021/11/23 00:00:00').getTime()
        remainTimer = setInterval(() => {
            startTime += 1000
            const start = moment(startTime);//获取开始时间
            const end = moment(endTime);//结束时间
            const diff = end.diff(start);//时间差
            const duration = moment.duration(diff)
            const remainHour = duration.hours()
            const remainMinutes = duration.minutes()
            const remainSeconds = duration.seconds()
            const time = `${format(remainHour)}:${format(remainMinutes)}:${format(remainSeconds)}`//格式化为需要的格式 这里是时分秒
            remainTime.value = time
        }, 1000)
    }

    function clearRemainTimer() {
        remainTimer && window.clearInterval(remainTimer)
        remainTimer = null
        remainTime.value = ''
    }

    return {
        remainTime,
        clearRemainTimer,
        startCountDown
    }
}

import { post } from '@/utils/request'

export default {
    tenQuestions: query => post('/api/student/game/tenQuestions', query),
    pass: query => post(' api/student/game/pass', query),
    answerSubmit: form => post('/api/student/exampaper/answer/answerSubmit', form),
    read: id => post('/api/student/exampaper/answer/read/' + id),
    edit: form => post('/api/student/exampaper/answer/edit', form),
    rivalAvatar:id => post(' /api/student/user/avatars/' + id),
    updatePass: form => post('/api/student/game/updatePass', form),
    getPass:id => post(' /api/student/game/getPass/' + id),
    


 
}

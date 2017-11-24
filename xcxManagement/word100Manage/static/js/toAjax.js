import axios from 'axios'
// 获取单词管理列表
let services = 'http://114.215.110.243:9999/Word/WordBook';

//获取GetWordAppContent所有课程
// export function getWordAppContent(adviser_id,app_content_name,pageIndex,pageSize) {
//     return new Promise((resolve, reject) => {
//         let url =  `${services}/GetWordAppContent?adviser_id=${adviser_id}&app_content_name=${app_content_name}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
//         axios.get(url)
//             .then(response => {
//                 resolve(response.data);
//             }).catch((error) => {
//                 reject(error);
//         })
//     })
// }

export function getWordAppContent(targetArr,adviser_id,app_content_name) {
    return new Promise((resolve, reject) => {
        let url =  `${services}/GetWordAppContent`;
        axios.get(url,{
            params:{
                adviser_id : adviser_id,
                app_content_name : app_content_name,
                pageIndex : targetArr.length / 12 + 1,
                pageSize:12
            }
        })
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
        })
    })
}
//获取指定课程的内容信息
export function getLessonContent(adviser_id,word_app_content_id) {
    return new Promise((resolve, reject) => {
        let url =  `${services}/GetWordAppContent?adviser_id=${adviser_id}&word_app_content_id=${word_app_content_id}`;
        axios.get(url)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}
//获取活动（查询）
export function getActivitys() {
    let url = `${services}/GetActivitys`
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}
//获取基本信息
export function getDictData(dict_type_id) {
    let url = `${services}/GetDictData?dict_type_id=${dict_type_id}`
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}
//删除课程
export function delWordAppContent(id) {
    let url = `${services}/DelWordAppContent?id=${id}`
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//保存课程信息
export function saveWordAppContent(parameter) {
    return new Promise((resolve, reject) => {
        let url = `${services}/SaveWordAppContent`;
        console.log("执行2")
        console.log("parameter",parameter)
        axios.post(url,parameter)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//获取单词（查询）
export function getWord(word_app_content_id,word_name,added,pageIndex,pageSize) {
    let url = `${services}/GetWord?word_app_content_id=${word_app_content_id}&word_name=${word_name}&added=${added}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

// 删除单词
export function delWord(id) {
    return new Promise((resolve, reject) => {
        let url =  `${services}/DelWord?ids=${id}`;
        axios.get(url)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//SaveWord
export function saveWord(parameter) {
    return new Promise((resolve, reject) => {
        let url = `${services}/SaveWord`;
        console.log("执行2")
        console.log("parameter",parameter)
        axios.post(url,parameter)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//单词导入ImportWord
export function importWord(parameter) {
    return new Promise((resolve, reject) => {
        let url = `${services}/ImportWord`;
        axios.post(url,parameter)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//获取所有的关卡GetLevels
export function getLevels(word_app_content_id) {
    return new Promise((resolve, reject) => {
        let url = `${services}/GetLevels?word_app_content_id=${word_app_content_id}`;
        axios.get(url)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
                console.log("getLevels",error)
            })
    })
}

//  上传文件到第三方服务器  利用其回传url   利用其url回传到专用服务器

export function returnDataUrl(parameter) {
    return new Promise((resolve, reject) => {
    let url = 'http://filecloud.test.codebook.com.cn/api/Files/UploadFileToTence';
        console.log("parameter", parameter)
        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        axios
            .post(url, parameter,config)
            .then(response => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            })
    })
}


//获得所有关卡及单词
export function getLevelAndWord(word_app_content_id, level_name, pageIndex, pageSize) {
    return new Promise((resolve, reject) => {
        let url = `${services}/GetLevelAndWord?word_app_content_id=${word_app_content_id}&level_name=${level_name}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
        axios
            .get(url)
            .then(response => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
                console.log("getLevelAndWord", error)
            })
    })   
}


//删除指定关卡的单词  byId
export function delWordOfLevel(parameter) {
    return new Promise((resolve, reject) => {
    let url = `${services}/DelWordOfLevel`;
    axios
        .post(url, parameter)
        .then(response => {
            resolve(response.data);
        })
        .catch((error) => {
            reject(error);
        })
    })
 }

 //删除指定关卡
export function delLevel(parameter) {
    return new Promise((resolve, reject) => {
    let url = `${services}/DelLevel?id=${parameter}`;
    axios.get(url)
        .then(response => {
            resolve(response.data);
        })
        .catch((error) => {
            reject(error);
            console.log("getLevelAndWord", error)
        })
    })
 }


 //保存关卡单词
export function saveLevelWord(parameter) {
    return new Promise((resolve, reject) => {
        let url = `${services}/SaveLevelWord`;
        axios
            .post(url, parameter)
            .then(response => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            })
    })
}

//获取指定课程管理中的单词管理的词数和案例管理中的卡片书
export  function getWordAndLevelCount(parameter) {
    return new Promise((resolve, reject) => {
    let url = `${services}/GetWordAndLevelCount?word_app_content_id=${parameter}`;
        axios
            .get(url)
            .then(response => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            console.log("getWordAndLevelCount", error)
            })
    })
}
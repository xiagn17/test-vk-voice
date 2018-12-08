const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');



const app = express();
const port = process.env.PORT || 3000;


const server = app.listen(port, function () {
    console.log('index has been started');


    fetch(getURL("messages.getLongPollServer"))
        .then(data => data.json())
        .then(data => {
            const {key, server, ts} = data.response;
            fetchSync(key, server, ts);
        })
        .catch(err => console.log(err));

});


// static files
app.use(express.static('public'));





// script handler



function getURL (method) {
    return 'https://api.vk.com/method/' + method + '?' + arguments[1] + '&v=5.52&access_token=b6a451fd5675e84a75cae57af5672033caced242eed4a1e0b2fa12590fd2b36ba96b5a1c5476d645de759';
}



function doData(data) {
    data.forEach(event => {

        if (event[0] !== 4)
            return;

        const id = event[3];
        const msg = event[5] ? event[5] : event[event.length - 1].attach1_kind;


        if (msg && (id === 244677833 || id === 157408846 || id === 381532265) && msg.toLowerCase().search(/демка/) !== -1) {

            const params = encodeURI('user_id=' + id + '&random_id=' + Math.floor(Math.random()*2000000)
                + '&attachment=photo135136825_456250621' + '&message=ключ слово сработало)))');

            fetch(getURL('messages.send', params))
                .catch(err => console.log(err))
        }

        if (msg && msg.toLowerCase().search(/а\s*т\s*м\s*о\s*с\s*ф\s*е\s*р/) !== -1) {

            let posts_1000 = [];
            let urls = [];

            for (let i = 0; i < 2; i++) {
                urls.push(getURL('wall.get', 'owner_id=-163929488&count=100' + '&offset=' + i * 100));
            }

            let promises = urls.map(
                url => fetch(url)
                    .then(data => data.json())
                    .then(data => posts_1000.push(...data.response.items))
                    .then(data => Promise.resolve(data))
                    .catch(err => console.log(err))
            );

            Promise.all(promises)
                .then((value) => {

                    const post = posts_1000[Math.floor(Math.random() * posts_1000.length)];
                    const attachment = post.attachments[Math.floor(Math.random() * post.attachments.length)];

                    if (attachment.type === 'photo') {
                        const photo = attachment.photo;
                        const photoID = '-163929488_' + photo.id;
                        const accessKey = photo.access_key;

                        const messageTo = (id === 381532265) ? 'Катя💘' : 'Никита самый охуенный';


                        const params = encodeURI('peer_id=' + id + '&random_id=' + Math.floor(Math.random()*2000000)
                            + '&attachment=photo' + photoID + '_' + accessKey + '&message=' + messageTo);


                        fetch(getURL('messages.send', params))
                            .catch(err => console.log(err))
                    }
                });



        }

        if (msg === 'audiomsg') {

        }


    });
}

function fetchSync (key, server, ts) {
    fetch('https://' + server + '?act=a_check&key=' + key + '&ts=' + ts + '&wait=25&mode=2&version=3')
        .then(data => data.json())
        .then(data => {

            doData(data.updates);

            fetchSync(key, server, data.ts);
        })
}




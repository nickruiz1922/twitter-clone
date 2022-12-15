import { tweetsData } from '/data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like)
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if (e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
})

function handleLikeClick(tweetId){

    const targetTweetObject = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObject.isLiked){
        targetTweetObject.likes--
    }
    else{
        targetTweetObject.likes++
    }
    targetTweetObject.isLiked = !targetTweetObject.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObject = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if(targetTweetObject.isRetweeted){
        targetTweetObject.retweets--
    }
    else{
        targetTweetObject.retweets++ 
    }
    targetTweetObject.isRetweeted = !targetTweetObject.isRetweeted
    render()
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    if (tweetInput.value){
        tweetsData.unshift(
            {
                handle: `@Scrimba`,
                profilePic: `images/scrimbalogo.png`,
                likes: 0,
                retweets: 0,
                tweetText: tweetInput.value,
                replies: [],
                isLiked: false,
                isRetweeted: false,
                uuid: uuidv4()
            })
            tweetInput.value = ''
            render()
    }   
}

function getFeedHtml(){
    let feedHtml = ``

    tweetsData.forEach(function(tweet){

        let likeIconClass = ''
        let sharedIconClass = ''

        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        if (tweet.isRetweeted){
            sharedIconClass = 'retweeted'
        }

        let repliesHtml = ``

        if (tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml += `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                </div>`
            })
        }

        feedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                        <i class="fa-regular fa-comment-dots"
                        data-reply="${tweet.uuid}"
                        ></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                        <i class="fa-solid fa-heart ${likeIconClass}"
                        data-like="${tweet.uuid}"
                        ></i>
                            ${tweet.likes}                        
                        </span>
                        <span class="tweet-detail">
                        <i class="fa-solid fa-retweet ${sharedIconClass}"
                        data-retweet="${tweet.uuid}"
                        ></i>
                            ${tweet.retweets} 
                        </span>
                    </div>   
                </div>            
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                ${repliesHtml}
            </div>   
        </div>`
    })
    return feedHtml
}
getFeedHtml()

function render(){
    document.querySelector('#feed').innerHTML = getFeedHtml()
}
render()
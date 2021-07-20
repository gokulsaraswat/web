fetch(`https://api.github.com/users/${new URL(location.href).searchParams.get('q') || "Gokul-saraswat"}`)
.then((response)=>{
    return response.json()
})
.then((json)=>{
    console.log(json)
    if(json.message === "Not Found"){
        console.log("Cannot get user details")
        return
    }
    let avatar = document.createElement("img")
    avatar.src = json.avatar_url
    document.querySelector(".avatar .wrap").append(avatar)
    let profileLink = document.createElement("a")
        profileLink.href = json.html_url
    profileLink.textContent = json.name
    document.querySelector(".avatar .name").append(profileLink)

    //list repos
    fetch(json.repos_url)
        .then((response)=>{
            return response.json()
        })
        .then(async (repos)=>{
            let reposDiv = document.querySelector(".repos .list")
            for(let repo of repos){
                let repoDiv = document.createElement("div")
                reposDiv.append(repoDiv)
                let link = document.createElement("a")
                link.href = repo.html_url
                link.textContent = repo.name
                repoDiv.append(link)
                let desc = document.createElement("div")
                desc.classList.add("desc")
                desc.textContent = repo.description || "No Description Provided"
                repoDiv.append(desc)
                let languages = document.createElement("div")
                languages.append(...await fetch(repo.languages_url)
                    .then((response)=>{
                        return response.json()
                    })
                    .then((languages)=>{
                        let languageDivs = []
                        let totalUsage = 0
                        for(let language in languages)
                            totalUsage += languages[language]
                        for(let language in languages){
                            let languagesDiv = document.createElement("span")
                            languageDivs.push(languagesDiv)
                            languagesDiv.textContent = `${language} (${Math.floor(100*languages[language]/totalUsage)}%)`
                        }
                        return languageDivs
                    })
                )
                repoDiv.append(languages)
            }
        })

    // list followers
    fetch(json.followers_url)
        .then((response)=>{
            return response.json()
        })
        .then((followers)=>{
            // console.log(followers)
            let followersDiv = document.querySelector(".followers .list")
            document.querySelector(".followers .count")
                .textContent = `${followers.length} followers`
            for (let follower of followers){
                let followerDiv = document.createElement("div")
                followersDiv.append(followerDiv)
                let followerLink = document.createElement("a")
                followerDiv.append(followerLink)
                followerLink.href = `?q=${follower.login}`
                followerLink.textContent = follower.login
            }
        })
})


// import {Octokit} from "@octokit/core";
const {Octokit} = require("@octokit/rest");
const {Client} = require('@notionhq/client');
const notion = new Client({auth: process.env.AUTH_NOTION});



async function start() {
    const octokit = new Octokit({
        auth: process.env.AUTH_GITHUB
    })
    const res = await octokit.request('GET /repos/hann101/SpringBootStudy/commits', {
        owner: 'OWNER',
        repo: 'REPO'
    })

    let data = res.data;

    console.log(res.data)

    const output = res.data;
    // console.log(res.data[0])

    const pageLists = [];
    output.map(v => {
            var notionPage = new Object();
            notionPage.commitMessage = v['commit']['message'];
            notionPage.commitId = v['sha'];
            notionPage.commitDate = v['commit']['committer']['date'];
            // notionPage.htmlUrl = v['html_url']
            //     console.log(
            //     v['commit']['message'] +'\n' +v['html_url']
            //     )
            pageLists.push(notionPage)
        }
    )
    return await pageLists;
}
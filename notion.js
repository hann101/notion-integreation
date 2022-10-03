// async/await 를 활용하는 수정된 방식
const {Octokit} = require("@octokit/rest");
const {Client} = require('@notionhq/client');
const core = require('@actions/core');
const github = require('@actions/github');
const {makeConsoleLogger} = require("@notionhq/client/build/src/logging");

require("dotenv").config();


const notion = new Client({auth: process.env.AUTH_NOTION});

const TestApiCall = async () => {
    try {
        //git auth
        const githubAuth = core.getInput('who-to-greet');

        //


        const octokit = new Octokit({
            // auth: githubAuth
            auth: process.env.AUTH_GITHUB
        })
        const responseGit = await octokit.request('GET /repos/{owner}/{repo}/commits', {
            owner: process.env.ID_GITHUB,
            repo: process.env.REPO_GITHUB
        })


        const output = responseGit.data;
        // console.log(responseGit.data[0])

        const pageLists = [];
        output.map(v => {
                var notionPage = new Object();
                notionPage.commitMessage = v['commit']['message'];
                notionPage.commitId = v['sha'];
                notionPage.commitDate = v['commit']['committer']['date'];
                notionPage.htmlUrl = v['html_url']
                pageLists.push(notionPage)
            }
        )

        console.log(pageLists[0]['commitMessage'])
        // makeNotionPage(pageLists)
        pageLists.map(value => makeNotionPage(value))


    } catch (err) {
        console.log("Error >>", err);
    }
}
TestApiCall();



async function makeNotionPage(pageList) {
    const response = await notion.pages.create({
        parent: {
            database_id: process.env.DB_NOTION
        },
        properties: {
            'Commit Message': {
                title: [
                    {
                        type: 'text',
                        text: {
                            content: pageList['commitMessage'],
                        },
                    },
                ],
            },
            'Commit ID': {
                "rich_text": [
                    {
                        "type": "text",
                        "text": {
                            "content": pageList['commitId']
                        }
                    }
                ]
            },
            'Created Date': {
                type: 'date',
                date: {
                    start: pageList['commitDate'],
                },
            },
            "URL": {
                "url": pageList['htmlUrl']
            }
        },
    });
    console.log(response);

    console.log("========================")
}

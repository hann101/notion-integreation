const {Client} = require('@notionhq/client');
//test
const notion = new Client({auth: process.env.AUTH_NOTION});

(async () => {
    const response = await notion.pages.create({
        parent: {
            database_id: process.env.DB_NOTION,
        },
        properties: {
            'Commit Message': {
                title: [
                    {
                        type: 'text',
                        text: {
                            content: 'Tomatoes',
                        },
                    },
                ],
            },
            'Commit ID': {
                "rich_text": [
                    {
                        "type": "text",
                        "text": {
                            "content": "Some more text with "
                        }
                    }
                ]
            },
            'Created Date': {
                type: 'date',
                date: {
                    start: '2021-05-11',
                },
            },
        },
    });
    console.log(response);
})();
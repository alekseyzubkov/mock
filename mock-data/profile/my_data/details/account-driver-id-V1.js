module.exports = {
  path: '',
  method: 'POST',
  body: {
    pageKey: 'account-driver-id',
  },
  headers: {
    'sravni-api-version': '1'
  },
  result_data: {
    screenConfig: {
      title: '',
    },
    content: {
      items: [
        {
          type: 'textStack',
          configuration: {
            title: 'Водительское удостоверение',
            titleAlignment: 'left',
            titleColor: 'dark100',
            titleFont: 'h3Headline',
          },
          margins: {
            start: '16',
            end: '16',
          },
        },
        {
          type: 'spacer',
          configuration: {
            size: '16',
            backgroundColor: 'transparent',
          },
        },
        {
          type: 'baseListItem',
          configuration: {
            backgroundColor: 'blue06',
            cornerRadius: '16',
          },
          items: [
            {
              type: 'avatar',
              configuration: {
                backgroundColor: 'transparent',
                size: 'medium',

                imageUrlSVG: 'https://s44751.cos.ngenix.net/MobileMockService/unknown/20221110_01/image4.png',
                imageUrlPDF: 'https://s44751.cos.ngenix.net/MobileMockService/unknown/20221110_01/image4.png',
              },
            },
            {
              type: 'textStack',
              configuration: {
                title: 'Данные с Госуслуг',
                titleFont: 'subtitleXL',
                descriptionFont: 'captionXS',
                description: 'Загружены из вашей учётной записи',
              },
            },
          ],
          margins: {
            start: '16',
            end: '16',
          },
        },
        {
          type: 'spacer',
          configuration: {
            size: '16',
            backgroundColor: 'transparent',
          },
        },
        {
          type: 'baseBlock',
          configuration: {
            cornerRadius: '16',
            backgroundColor: 'dark10',
          },
          margins: {
            start: '16',
            end: '16',
          },
          items: [
            {
              type: 'spacer',
              configuration: {
                size: '16',
                backgroundColor: 'dark10',
              },
            },
            {
              type: 'textStack',
              configuration: {
                title: '11 23 234432',
                titleAlignment: 'left',
                titleColor: 'dark100',
                titleFont: 'bodyL',
                titleMaxLines: '2',
                subtitle: 'Серия и номер прав',
                subtitleAlignment: 'left',
                subtitleColor: 'dark60',
                subtitleFont: 'captionXS',
                subtitleMaxLines: '1',
              },
              margins: {
                start: '16',
                end: '16',
              },
            },
            {
              type: 'spacer',
              configuration: {
                size: '24',
                backgroundColor: 'dark10',
              },
            },
            {
              type: 'textStack',
              configuration: {
                title: 'Шариков Полиграф Полиграфович',
                titleAlignment: 'left',
                titleColor: 'dark100',
                titleFont: 'bodyL',
                titleMaxLines: '2',
                subtitle: 'Фамилия, имя, отчество',
                subtitleAlignment: 'left',
                subtitleColor: 'dark60',
                subtitleFont: 'captionXS',
                subtitleMaxLines: '1',
              },
              margins: {
                start: '16',
                end: '16',
              },
            },
            {
              type: 'spacer',
              configuration: {
                size: '24',
                backgroundColor: 'dark10',
              },
            },
            {
              type: 'textStack',
              configuration: {
                title: '06.01.1925',
                titleAlignment: 'left',
                titleColor: 'dark100',
                titleFont: 'bodyL',
                titleMaxLines: '2',
                subtitle: 'Дата рождения',
                subtitleAlignment: 'left',
                subtitleColor: 'dark60',
                subtitleFont: 'captionXS',
                subtitleMaxLines: '1',
              },
              margins: {
                start: '16',
                end: '16',
              },
            },
            {
              type: 'spacer',
              configuration: {
                size: '24',
                backgroundColor: 'dark10',
              },
            },
            {
              type: 'textStack',
              configuration: {
                title: '16.01.1925',
                titleAlignment: 'left',
                titleColor: 'dark100',
                titleFont: 'bodyL',
                titleMaxLines: '2',
                subtitle: 'Дата выдачи',
                subtitleAlignment: 'left',
                subtitleColor: 'dark60',
                subtitleFont: 'captionXS',
                subtitleMaxLines: '1',
              },
              margins: {
                start: '16',
                end: '16',
              },
            },
            {
              type: 'spacer',
              configuration: {
                size: '24',
                backgroundColor: 'dark10',
              },
            },
            {
              type: 'textStack',
              configuration: {
                title: '2008',
                titleAlignment: 'left',
                titleColor: 'dark100',
                titleFont: 'bodyL',
                titleMaxLines: '2',
                subtitle: 'Год начала стажа',
                subtitleAlignment: 'left',
                subtitleColor: 'dark60',
                subtitleFont: 'captionXS',
                subtitleMaxLines: '1',
              },
              margins: {
                start: '16',
                end: '16',
              },
            },
            {
              type: 'spacer',
              configuration: {
                size: '16',
                backgroundColor: 'dark10',
              },
            },
          ],
        },
      ],
    },
  }
}

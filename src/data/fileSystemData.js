import reportPdf from '../assets/documents/work/1.pdf';
import resumePdf from '../assets/documents/resume.pdf';
import vacationJpg from '../assets/pictures/1.jpg';

export const fileSystemData = [
    {
        id: "mypc",
        label: "MyPC",
        type: "mypc",
        iconType: "mypc",
        position: { top: 20, left: 5 },
        contents: [
          {
            id: "vacation.jpg",
            label: "Vacation.jpg",
            type: "image",
            iconType: "image",
            content: vacationJpg,
          },
        ],
      },
  {
    
    id: "documents",
    label: "Documents",
    type: "folder",
    iconType: "folder",
    position: { top: 20, left: 10 },
    contents: [
      {
        id: "work",
        label: "Work",
        type: "folder",
        iconType: "folder",
        contents: [
          {
            id: "report.pdf",
            label: "Report.pdf",
            type: "pdf",
            iconType: "pdf",
            content: reportPdf,
          },
        ],
      },
      {
        id: "resume.pdf",
        label: "Resume.pdf",
        type: "pdf",
        iconType: "pdf",
        content: resumePdf,
      },
    ],
  },
  {
    id: "pictures",
    label: "Pictures",
    type: "folder",
    iconType: "folder",
    position: { top: 100, left: 5 },
    contents: [
      {
        id: "vacation.jpg",
        label: "Vacation.jpg",
        type: "image",
        iconType: "image",
        content: vacationJpg,
      },
    ],
  },
  {
    id: "terminal",
    label: "Terminal",
    type: "terminal",
    iconType: "terminal",
    position: { top: 100, left: 10 },  
    contents: [
      {
        id: "command",
        label: "Command",
        type: "text",
        content: "Welcome to the JS Terminal!\nType JavaScript commands below:",
      },
    ],
  },
];

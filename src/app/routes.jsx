import { createBrowserRouter } from 'react-router-dom';

const FeedbackBoardPage = () => import('../pages/feedback-board/FeedbackBoardPage.jsx');

const router = createBrowserRouter([
  {
    path: '/',
    lazy: async () => {
      const { default: Component } = await FeedbackBoardPage();
      return { Component };
    },
  },
]);

export default router;

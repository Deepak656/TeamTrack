import { Screens } from '../constants/screens';

// Stack Navigator Types
export type RootStackParamList = {
  [Screens.Login]: undefined;
  [Screens.MainTabs]: undefined;
  [Screens.CreateTask]: undefined;
  [Screens.Tasks]: undefined;
  [Screens.TaskDetail]: { task: any };
  [Screens.AddEmployee]: undefined;
  [Screens.ListEmployees]: undefined;
};


// Tab Navigator Types (Optional, if you're using tabs)
export type TabParamList = {
  [Screens.Tasks]: undefined;
};
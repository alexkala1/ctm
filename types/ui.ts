// UI Component Types
import type { SelectOption } from './common';
import type { TableColumn, Pagination, SortOptions } from './tournament';

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export type NotificationInput = Omit<Notification, 'id'>;

export interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn[];
  loading?: boolean;
  pagination?: Pagination;
  sort?: SortOptions;
  filters?: Record<string, unknown>;
  selectable?: boolean;
  selectedRows?: string[];
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
}

// Theme Types
export type ColorMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  colorMode: ColorMode;
  primaryColor: string;
  fontSize: 'sm' | 'md' | 'lg';
  fontFamily: string;
}

// Layout Types
export interface LayoutConfig {
  sidebar: {
    collapsed: boolean;
    width: number;
    minWidth: number;
  };
  header: {
    height: number;
    sticky: boolean;
  };
  footer: {
    height: number;
    visible: boolean;
  };
}

// Navigation Types
export interface NavigationItem {
  label: string;
  icon?: string;
  href?: string;
  children?: NavigationItem[];
  badge?: string | number;
  disabled?: boolean;
  external?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

// Dashboard Types
export interface DashboardStats {
  totalTournaments: number;
  activeTournaments: number;
  totalCompetitors: number;
  pendingApprovals: number;
  recentRegistrations: number;
  categoryDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
  data?: Record<string, unknown>;
}

// Component Props Types
export interface ButtonProps {
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface SelectProps {
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  multiple?: boolean;
  searchable?: boolean;
}

// Event Types
export interface TableEvent {
  type: 'select' | 'sort' | 'filter' | 'page' | 'row-click';
  data: Record<string, unknown>;
}

export interface FormEvent {
  type: 'submit' | 'reset' | 'change' | 'blur' | 'focus';
  data: Record<string, unknown>;
  field?: string;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type NonNullable<T> = T extends null | undefined ? never : T;

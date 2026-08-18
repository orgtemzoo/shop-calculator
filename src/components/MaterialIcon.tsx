import React from 'react';
import {
  Calculator,
  Plus,
  Pencil,
  Trash2,
  Share2,
  RefreshCw,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Trophy,
  SlidersHorizontal,
  X,
  Check,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Tag,
  CheckSquare,
  Square,
  Copy,
  Sun,
  Moon,
  Monitor,
  Download,
  Upload,
  Link,
  ArrowUpDown,
  Search,
  LucideIcon
} from 'lucide-react';

interface MaterialIconProps {
  name: string;
  className?: string;
  filled?: boolean;
}

const ICON_MAP: Record<string, LucideIcon> = {
  calculate: Calculator,
  add: Plus,
  edit: Pencil,
  delete: Trash2,
  delete_forever: Trash2,
  share: Share2,
  sync: RefreshCw,
  savings: PiggyBank,
  trending_down: TrendingDown,
  trending_up: TrendingUp,
  emoji_events: Trophy,
  tune: SlidersHorizontal,
  close: X,
  check: Check,
  check_circle: CheckCircle2,
  error: AlertCircle,
  info: Info,
  arrow_drop_down: ChevronDown,
  expand_more: ChevronDown,
  expand_less: ChevronUp,
  local_offer: Tag,
  sell: Tag,
  check_box: CheckSquare,
  check_box_outline_blank: Square,
  content_copy: Copy,
  light_mode: Sun,
  dark_mode: Moon,
  desktop_windows: Monitor,
  download: Download,
  upload: Upload,
  link: Link,
  sort: ArrowUpDown,
  search: Search
};

export const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  className = 'w-4 h-4'
}) => {
  const IconComponent = ICON_MAP[name] || Info;

  return (
    <IconComponent
      className={`inline-block shrink-0 stroke-[2] ${className}`}
      aria-hidden="true"
    />
  );
};

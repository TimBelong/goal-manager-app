import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MONTHS_LIST, MonthKey } from '../types';

export interface TranslatedMonth {
  key: MonthKey;
  name: string;
  order: number;
}

export function useMonths() {
  const { t } = useTranslation();

  const months = useMemo<TranslatedMonth[]>(() => {
    return MONTHS_LIST.map((month) => ({
      key: month.key,
      name: t(`months.${month.key}`),
      order: month.order,
    }));
  }, [t]);

  const getMonthName = (key: MonthKey | string): string => {
    return t(`months.${key}`);
  };

  const getMonthByKey = (key: string): TranslatedMonth | undefined => {
    return months.find((m) => m.key === key);
  };

  const getMonthByOrder = (order: number): TranslatedMonth | undefined => {
    return months.find((m) => m.order === order);
  };

  return { months, getMonthName, getMonthByKey, getMonthByOrder };
}

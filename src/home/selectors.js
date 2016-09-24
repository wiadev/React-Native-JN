import { NAME } from './constants';
import { createSelector } from 'reselect';
import filter from 'lodash/filter';
import mockData from '../mockData';

export const getFeed = (state) => state[NAME].feed;
export const getFilterId = (state) => state[NAME].filterId;
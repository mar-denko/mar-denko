import groupsRepository from "./groups/groupsRepository";
import positionsRepository from "./positions/positionsRepository";
import dictsRepository from "./dicts/dictsRepository";
import ordersRepository from "./orders/ordersRepository";
import postsRepository from "./posts/postsRepository";
import geoDataRepository from "./geoData/geoDataRepository";
import slidesRepository from "./slides/slidesRepository";
import restaurantsRepository from "./restaurants/restaurantsRepository";
import usersRepository from "./users/usersRepository";

const repositories = {
  groups: groupsRepository,
  positions: positionsRepository,
  dicts: dictsRepository,
  orders: ordersRepository,
  posts: postsRepository,
  geoData: geoDataRepository,
  slides: slidesRepository,
  restaurants: restaurantsRepository,
  users: usersRepository,
};

export const DataFactory = {
  get: (name) => repositories[name],
};

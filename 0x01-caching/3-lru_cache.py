#!/usr/bin/env python3
"""LRU Caching
"""
import collections
from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """LRU Cache class
    """
    def __init__(self):
        """Constructor
        """
        super().__init__()
        self.cache_data = collections.OrderedDict()
        self.lru = None

    def put(self, key, item):
        """Add an item in the cache
        """
        if key and item:
            self.cache_data[key] = item
            self.lru = key
        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            discard = self.cache_data.popitem(last=False)
            print('DISCARD: {}'.format(discard[0]))

    def get(self, key):
        """Get an item by key
        """
        if key in self.cache_data:
            self.lru = key
            return self.cache_data[key]
        return None

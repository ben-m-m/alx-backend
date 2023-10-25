#!/usr/bin/env python3
"""
FIFOCache caching system
"""
from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """
    caching using FIFO algorithm
    """
    def __init__(self):
        """
        initializing class instance
        """
        super().__init__()
        self.order_keys = []

    def put(self, key, item):
        """
        add item to cache
        """
        if key is None or item is None:
            return

        if len(self.cache_data) >= \
                self.MAX_ITEMS and key not in self.cache_data:
            discarded_key = self.order_keys.pop(0)
            del self.cache_data[discarded_key]
            print("DISCARD: {}".format(discarded_key))

        if key not in self.cache_data:
            self.order_keys.append(key)

        self.cache_data[key] = item

    def get(self, key):
        """
        retrieve an item from cache
        """
        if key is None:
            return None
        return self.cache_data.get(key, None)

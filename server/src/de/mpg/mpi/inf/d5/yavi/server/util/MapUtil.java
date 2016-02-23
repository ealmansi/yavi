package de.mpg.mpi.inf.d5.yavi.server.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

public class MapUtil {
  public static final Comparator<Entry<Integer, Double>> MAP_ENTRY_VALUE_COMPARATOR_DESC =
      Collections.reverseOrder(new MapEntryValueComparator());

  public static <K, V> List<Entry<K, V>> getTopEntries(Map<K, V> map, Comparator<Entry<K, V>> comparator, int limit) {
    List<Entry<K, V>> entries = new ArrayList<>(map.entrySet());
    Collections.sort(entries, comparator);
    List<Entry<K, V>> topEntries = entries.subList(0, Math.min(entries.size(), limit));
    return topEntries;
  }

  public static <K, V> List<Entry<K, V>> getTopHalfEntries(Map<K, V> map, Comparator<Entry<K, V>> comparator) {
    List<Entry<K, V>> entries = new ArrayList<>(map.entrySet());
    if (entries.size() < 2) {
      return entries;
    }
    Collections.sort(entries, comparator);
    List<Entry<K, V>> topEntries = entries.subList(0, Math.min(entries.size(), Math.max(entries.size() / 5, 100)));
    return topEntries;
  }
  
  public static class MapEntryValueComparator implements Comparator<Entry<Integer, Double>> {
    @Override
    public int compare(Entry<Integer, Double> entry, Entry<Integer, Double> otherEntry) {
      int valueCompare = entry.getValue().compareTo(otherEntry.getValue());
      if (valueCompare != 0) {
        return valueCompare;
      }
      return entry.getKey().compareTo(entry.getKey());
    }
  }
}

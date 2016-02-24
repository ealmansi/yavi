package de.mpg.mpi.inf.d5.yavi.server.resources;

import java.util.Set;

import com.google.common.collect.ImmutableSet;

public class ResourceUtil {

  private static final Set<String> VALID_WIKIPEDIA_IDS =
      ImmutableSet.of("en", "de", "ja", "ru", "es", "fr", "it", "pt", "zh", "pl");
  
  public static boolean isValidWikipediaId(String wikipediaId) {
    return VALID_WIKIPEDIA_IDS.contains(wikipediaId);
  }

  public static boolean isValidPeriod(int dayFrom, int dayTo) {
    return dayFrom > 0 && dayTo > 0 && dayFrom <= dayTo;
  }

}

package de.mpg.mpi.inf.d5.yavi.wikipedia.export;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * YaviWikilinksExtractor
 */
public class YaviWikilinksExtractor {
  private static final String BRACKET_L = Pattern.quote("[");
  private static final String BRACKET_R = Pattern.quote("]");
  private static final String NOT_BRACKET_R = "[^" + BRACKET_R + "]";
  private static final String MANY_NOT_BRACKET_R = NOT_BRACKET_R + "{0,1000}";
  private static final String MANY_NOT_BRACKET_R_GROUP = "(" + MANY_NOT_BRACKET_R + ")";
  private static final Pattern WIKILINK_PATTERN =
      Pattern.compile(BRACKET_L + BRACKET_L + MANY_NOT_BRACKET_R_GROUP + BRACKET_R + BRACKET_R);

  /**
   * extractWikilinks
   */
  public static List<CharSequence> extractWikilinks(CharSequence content) {
    SortedSet<CharSequence> wikilinks = new TreeSet<>();
    Matcher matcher = WIKILINK_PATTERN.matcher(content);
    while (matcher.find()) {
      String match = matcher.group(1);
      if (!match.isEmpty()) {
        wikilinks.add(match);
      }
    }
    return new ArrayList<>(wikilinks);
  }
}

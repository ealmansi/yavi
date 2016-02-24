package de.mpg.mpi.inf.d5.yavi.server;

import java.util.List;
import java.util.Set;

import com.google.common.collect.ImmutableSet;

import de.mpg.mpi.inf.d5.yavi.server.beans.DayNumberValuePair;
import de.mpg.mpi.inf.d5.yavi.server.providers.SignalProvider;

public class PageActivitySignal {

  private static final Set<String> VALID_SIGNAL_TYPES =
      ImmutableSet.of("numberofrevisions",
                      "numberofrevertedrevisions",
                      "numberofuniqueeditors",
                      "pagecontentsize",
                      "numberoftotaloutlinks",
                      "numberofaddedoutlinks",
                      "numberofaddedinlinks");
  
  public static boolean isValidSignalType(String signalType) {
    return VALID_SIGNAL_TYPES.contains(signalType);
  }
  
  public static List<DayNumberValuePair> getPageActivitySignal(int pageId,
                                                      String wikipediaId,
                                                      int dayFrom,
                                                      int dayTo,
                                                      String signalType) {
    List<DayNumberValuePair> pageActivitySignal = null;
    switch(signalType) {
    case "numberofrevisions":
      pageActivitySignal = SignalProvider.getNumberOfRevisions(pageId, wikipediaId, dayFrom, dayTo);
      break;
    case "numberofrevertedrevisions":
      pageActivitySignal = SignalProvider.getNumberOfRevertedRevisions(pageId, wikipediaId, dayFrom, dayTo);
      break;
    case "numberofuniqueeditors":
      pageActivitySignal = SignalProvider.getNumberOfUniqueEditors(pageId, wikipediaId, dayFrom, dayTo);
      break;
    case "pagecontentsize":
      pageActivitySignal = SignalProvider.getPageContentSize(pageId, wikipediaId, dayFrom, dayTo);
      break;
    case "numberoftotaloutlinks":
      pageActivitySignal = SignalProvider.getNumberOfTotalOutlinks(pageId, wikipediaId, dayFrom, dayTo);
      break;
    case "numberofaddedoutlinks":
      pageActivitySignal = SignalProvider.getNumberOfAddedOutlinks(pageId, wikipediaId, dayFrom, dayTo);
      break;
    case "numberofaddedinlinks":
      pageActivitySignal = SignalProvider.getNumberOfAddedInlinks(pageId, wikipediaId, dayFrom, dayTo);
      break;
    default:
      break;
    }
    return pageActivitySignal;
  }
}

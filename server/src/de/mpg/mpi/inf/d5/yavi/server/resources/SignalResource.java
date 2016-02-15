package de.mpg.mpi.inf.d5.yavi.server.resources;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import org.glassfish.jersey.server.JSONP;

import de.mpg.mpi.inf.d5.yavi.server.providers.SignalProvider;
import de.mpg.mpi.inf.d5.yavi.server.util.DateUtil;
import de.mpg.mpi.inf.d5.yavi.server.util.DateValue;
import de.mpg.mpi.inf.d5.yavi.server.util.DayValue;

@Path("/signal")
@Produces("application/x-javascript")
public class SignalResource {
  SignalProvider signalProvider = new SignalProvider();
  
  @GET
  @JSONP(queryParam = JSONP.DEFAULT_CALLBACK)
  public List<DateValue> doGet(@QueryParam("pageid") int pageId,
      @QueryParam("wikipediaid") String wikipediaId,
      @QueryParam("datefrom") String dateFrom,
      @QueryParam("dateto") String dateTo,
      @QueryParam("signaltype") String signalType) {
    int dayFrom = DateUtil.dateToDayNumber(dateFrom);
    int dayTo = DateUtil.dateToDayNumber(dateTo);
    List<DayValue> dayValueList = null;
    switch(signalType) {
    case "numberofrevisions":
      dayValueList = signalProvider.getNumberOfRevisions(pageId, wikipediaId, dayFrom, dayTo);
      break;
    case "numberofrevertedrevisions":
      dayValueList = signalProvider.getNumberOfRevertedRevisions(pageId, wikipediaId, dayFrom, dayTo);
      break;
    case "numberofuniqueeditors":
      dayValueList = signalProvider.getNumberOfUniqueEditors(pageId, wikipediaId, dayFrom, dayTo);
      break;
    case "pagecontentsize":
      dayValueList = signalProvider.getPageContentSize(pageId, wikipediaId, dayFrom, dayTo);
      break;
    case "numberoftotaloutlinks":
      dayValueList = signalProvider.getNumberOfTotalOutlinks(pageId, wikipediaId, dayFrom, dayTo);
      break;
    case "numberofaddedoutlinks":
      dayValueList = signalProvider.getNumberOfAddedOutlinks(pageId, wikipediaId, dayFrom, dayTo);
      break;
    case "numberofaddedinlinks":
      dayValueList = signalProvider.getNumberOfAddedInlinks(pageId, wikipediaId, dayFrom, dayTo);
      break;
    default:
      throw new WebApplicationException(Response.Status.BAD_REQUEST);
    }
    return convertDayValuesToDateValues(dayValueList);
  }

  private List<DateValue> convertDayValuesToDateValues(List<DayValue> dayValueList) {
    List<DateValue> dateValueList = new ArrayList<>();
    for (DayValue dayValue : dayValueList) {
      String date = DateUtil.dayNumberToDate(dayValue.getDay());
      int value = dayValue.getValue();
      dateValueList.add(new DateValue(date, value));
    }
    return dateValueList;
  }
}

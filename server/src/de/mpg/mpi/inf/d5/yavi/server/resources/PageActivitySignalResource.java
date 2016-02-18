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

import de.mpg.mpi.inf.d5.yavi.server.PageActivitySignal;
import de.mpg.mpi.inf.d5.yavi.server.beans.DateValuePair;
import de.mpg.mpi.inf.d5.yavi.server.beans.DayNumberValuePair;
import de.mpg.mpi.inf.d5.yavi.server.util.DateUtil;

@Path("/pageactivitysignal")
@Produces("application/x-javascript")
public class PageActivitySignalResource {
  
  @GET
  @JSONP(queryParam = JSONP.DEFAULT_CALLBACK)
  public List<DateValuePair> doGet(@QueryParam("pageid") int pageId,
      @QueryParam("wikipediaid") String wikipediaId,
      @QueryParam("datefrom") String dateFrom,
      @QueryParam("dateto") String dateTo,
      @QueryParam("signaltype") String signalType) {
    int dayFrom = DateUtil.dateToDayNumber(dateFrom);
    int dayTo = DateUtil.dateToDayNumber(dateTo);
    if (pageId > 0 &&
        ResourceUtil.isValidWikipediaId(wikipediaId) &&
        ResourceUtil.isValidPeriod(dayFrom, dayTo) &&
        PageActivitySignal.isValidSignalType(signalType)) {
      List<DayNumberValuePair> pageActivitySignal =
          PageActivitySignal.getPageActivitySignal(pageId, wikipediaId, dayFrom, dayTo, signalType);
      if (pageActivitySignal != null) {
        return convertDayNumbersToDates(pageActivitySignal);
      }
    }
    throw new WebApplicationException(Response.Status.BAD_REQUEST);
  }

  private List<DateValuePair> convertDayNumbersToDates(List<DayNumberValuePair> pageActivitySignal) {
    List<DateValuePair> dateValuePairList = new ArrayList<>();
    for (DayNumberValuePair dayNumberValuePair : pageActivitySignal) {
      String date = DateUtil.dayNumberToDate(dayNumberValuePair.getDayNumber());
      int value = dayNumberValuePair.getValue();
      dateValuePairList.add(new DateValuePair(date, value));
    }
    return dateValuePairList;
  }
}
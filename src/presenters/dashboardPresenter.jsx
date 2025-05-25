import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { UnauthorizedView } from "../views/unauthorizedView";
import { DashboardView } from "../views/dashboardView";
import { fetchQuote } from "../models/quotesSlice";
import { fetchWeather } from "../models/weatherSlice";
import { markHabitAsDone, unmarkHabitAsDone, fetchHabits } from "../models/habitsSlice";
import * as Location from "expo-location";

const mapStateToProps = (state) => ({
  user: state.auth.user,
  habits: state.habits.habits,
  quote: state.quotes.quote,
  quoteLoading: state.quotes.loading,
  quoteError: state.quotes.error,
  currentWeather: state.weather.current,
  weatherForecast: state.weather.forecast,
  weatherLoading: state.weather.loading,
  weatherError: state.weather.error,
});

const mapDispatchToProps = (dispatch) => ({
  onFetchQuote: () => dispatch(fetchQuote()),
  onFetchWeather: (coords) => dispatch(fetchWeather(coords)),
  onMarkHabitAsDone: (payload) => dispatch(markHabitAsDone(payload)),
  onUnmarkHabitAsDone: (payload) => dispatch(unmarkHabitAsDone(payload)),
  onFetchHabits: (userId) => dispatch(fetchHabits(userId)),
});

const DashboardPresenter = ({
  user,
  habits,
  quote,
  quoteLoading,
  quoteError,
  currentWeather,
  weatherForecast,
  weatherLoading,
  weatherError,
  onFetchQuote,
  onFetchWeather,
  onMarkHabitAsDone,
  onUnmarkHabitAsDone,
  onFetchHabits,
}) => {
  const [city, setCity] = useState("Your City");
  const [locationError, setLocationError] = useState("");
  const [locationDenied, setLocationDenied] = useState(false);
  const [hasAskedPermission, setHasAskedPermission] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      onFetchHabits(user.uid);
    }
  }, [user]);

  useEffect(() => {
    onFetchQuote();

    if (!hasAskedPermission) {
      (async () => {
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setLocationDenied(true);
            setLocationError("Location permission not granted.");
            return;
          }

          let location = await Location.getCurrentPositionAsync({});
          onFetchWeather({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          let address = await Location.reverseGeocodeAsync(location.coords);
          if (address.length > 0) {
            setCity(address[0].city || address[0].region || "Your City");
          }
        } catch (err) {
          setLocationDenied(true);
          setLocationError("Error getting location: " + err.message);
        } finally {
          setHasAskedPermission(true);
        }
      })();
    }
  }, [onFetchQuote, onFetchWeather, hasAskedPermission]);

  if (!user?.uid) {
    return <UnauthorizedView />;
  }

  return (
    <DashboardView
      user={user}
      habits={habits}
      quote={quote}
      quoteLoading={quoteLoading}
      quoteError={quoteError}
      currentWeather={currentWeather}
      weatherForecast={weatherForecast}
      weatherLoading={weatherLoading}
      weatherError={weatherError}
      onFetchQuote={onFetchQuote}
      onFetchWeather={onFetchWeather}
      onMarkHabitAsDone={onMarkHabitAsDone}
      onUnmarkHabitAsDone={onUnmarkHabitAsDone}
      city={city}
      locationError={locationError}
      locationDenied={locationDenied}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPresenter);

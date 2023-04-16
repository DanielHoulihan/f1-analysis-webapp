
import matplotlib.pyplot as plt
# import fastf1.plotting
from matplotlib import cm
import matplotlib
matplotlib.use('Agg')
import io
import numpy as np
import matplotlib as mpl
from matplotlib import pyplot as plt
from matplotlib.collections import LineCollection

def lap(session, driver):
    lap1 = session.laps.pick_driver(driver).pick_fastest()
    # lap2 = session.laps.pick_driver(driver2).pick_fastest()

    tel1 = lap1.get_car_data().add_distance()
    # tel2 = lap2.get_car_data().add_distance()

    return dict(zip(list(tel1['Distance']), list(tel1['Speed'])))


def speed(session, driver, year, weekend):
    
    colormap = plt.cm.plasma
    lap = session.laps.pick_driver(driver).pick_fastest()

    x = lap.telemetry['X']
    y = lap.telemetry['Y']
    color = lap.telemetry['Speed']

    points = np.array([x, y]).T.reshape(-1, 1, 2)
    segments = np.concatenate([points[:-1], points[1:]], axis=1)

    fig, ax = plt.subplots(sharex=True, sharey=True, figsize=(12, 6.75))
    fig.suptitle(f'{weekend.name} {year} - {driver} - Speed', size=24, y=0.97)

    plt.subplots_adjust(left=0.1, right=0.9, top=0.9, bottom=0.12)
    ax.axis('off')
    ax.plot(lap.telemetry['X'], lap.telemetry['Y'], color='black', linestyle='-', linewidth=16, zorder=0)

    norm = plt.Normalize(color.min(), color.max())
    
    lc = LineCollection(segments, cmap=colormap, norm=norm, linestyle='-', linewidth=5)
    lc.set_array(color)
    
    line = ax.add_collection(lc)
    cbaxes = fig.add_axes([0.25, 0.05, 0.5, 0.05])
    
    normlegend = mpl.colors.Normalize(vmin=color.min(), vmax=color.max())
    legend = mpl.colorbar.ColorbarBase(cbaxes, norm=normlegend, cmap=colormap, orientation="horizontal")
    
    # Save the plot to a bytes buffer
    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    plt.close(fig)
    return buf

def gear_shift(session, driver):
    lap = session.laps.pick_driver(driver).pick_fastest()
    tel = lap.get_telemetry()

    x = np.array(tel['X'].values)
    y = np.array(tel['Y'].values)

    points = np.array([x, y]).T.reshape(-1, 1, 2)
    segments = np.concatenate([points[:-1], points[1:]], axis=1)
    gear = tel['nGear'].to_numpy().astype(float)

    cmap = cm.get_cmap('Paired')
    lc_comp = LineCollection(segments, norm=plt.Normalize(1, cmap.N+1), cmap=cmap)
    lc_comp.set_array(gear)
    lc_comp.set_linewidth(4)

    plt.gca().add_collection(lc_comp)
    plt.axis('equal')
    plt.tick_params(labelleft=False, left=False, labelbottom=False, bottom=False)

    title = plt.suptitle(
        f"Fastest Lap Gear Shift Visualization\n"
        f"{lap['Driver']} - {session.event['EventName']} {session.event.year}"
    )

    cbar = plt.colorbar(mappable=lc_comp, label="Gear", boundaries=np.arange(1, 10))
    cbar.set_ticks(np.arange(1.5, 9.5))
    cbar.set_ticklabels(np.arange(1, 9))

    # Save the plot to a bytes buffer
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close()

    return buf

from selenium import webdriver
import numpy as np
import time

driver = webdriver.Firefox(executable_path='/Users/brad/Development/bdf_code/js-canvas-hack/geckodriver')

driver.get('http://slither.io')

def click_play_button():
    play_button = driver.find_element_by_css_selector('div#playh div.nsi')
    play_button.click()

click_play_button()

driver.execute_script('''window.render_mode = 1;
    window.want_quality = 0;
    window.high_quality = false;
    window.onmousemove = function(){};''')

time.sleep(2)

# main
while True:
    is_alive = driver.execute_script('return window.dead_mtm') # -1: alive

    if is_alive > 0: # dead
        time.sleep(4)
        click_play_button()
        # driver.execute_script('window.connect()')
        continue

    # get data
    try:
        my_snake = driver.execute_script('return window.snake')
        foods = driver.execute_script('return window.foods')
        other_snakes = driver.execute_script('return window.snakes')
        score = driver.execute_script('return Math.floor(15 * (fpsls[snake.sct] + snake.fam / fmlts[snake.sct] - 1) - 5)')
    except:
        my_snake = None
        foods = []
        other_snakes = []
        score = -1

    # print('Foods: %d\tSnakes: %d\tScore: %.2f' % (len(foods), len(other_snakes), score))

    if score < 0 or my_snake is None:
        continue

    # preprocess input data
    angle_division = 24

    max_dist_score = 0
    goal_food_index = 0

    for i, food in enumerate(foods):
        if food is None:
            continue

        dist = np.linalg.norm(np.array([my_snake['xx'], my_snake['yy']]) - np.array([food['xx'], food['yy']]))
        dist_score = 1 - dist / 1000

        if dist_score < 0:
            continue

        food_size = food['sz'] / 10

        if dist_score > max_dist_score:
            max_dist_score = dist_score
            goal_food_index = i

    # action
    if len(foods) > 0:
        goal_food = foods[goal_food_index]

        goal_food_angle_rad = np.arctan((goal_food['yy'] - my_snake['yy']) / (goal_food['xx'] - my_snake['xx'] + 0.001))
        goal_food_angle_deg = np.rad2deg(goal_food_angle_rad)
        goal_food_angle_index = np.floor(np.abs(goal_food_angle_deg / 360 * angle_division))
        if goal_food['xx'] - my_snake['xx'] >= 0 and goal_food['yy'] - my_snake['yy'] >= 0:
            goal_food_angle_index = int(goal_food_angle_index)
        elif goal_food['xx'] - my_snake['xx'] >=0 and goal_food['yy'] -my_snake['yy'] < 0:
            goal_food_angle_index = int(18 - goal_food_angle_index)
        elif goal_food['xx'] - my_snake['xx'] <0 and goal_food['yy'] - my_snake['yy'] >= 0:
            goal_food_angle_index = int(6 - goal_food_angle_index)
        elif goal_food['xx'] - my_snake['xx'] <0 and goal_food['yy'] -my_snake['yy'] < 0:
            goal_food_angle_index = int(12 + goal_food_angle_index)

    angle_index = goal_food_angle_index

    angle_deg = angle_index * 360 / angle_division
    angle_rad = np.deg2rad(angle_deg)
    goal_xy = [np.cos(angle_rad) * 300, np.sin(angle_rad) * 300]

    acc = 0 # normal: 0, acc: 1

    driver.execute_script('''window.xm = %s;
        window.ym = %s;
        window.setAcceleration(%d);''' % (goal_xy[0], goal_xy[1], acc))

    time.sleep(0.1)
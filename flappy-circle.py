from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
import time

driver = webdriver.Firefox(executable_path='/Users/brad/Development/bdf_code/js-canvas-hack/geckodriver')

driver.get('http://tanksw.com/flappy-circle/')

actions = ActionChains(driver)
spacebar = actions.send_keys(Keys.SPACE)

play_button = driver.find_element_by_css_selector('div#menu')
replay_button = driver.find_element_by_css_selector('div#replay')

play_button.click()

# driver.execute_script('window.VyN = -2') # 원이 낮게 점프한다
driver.execute_script('''window.line = [[0, 300], [400, 300], [500, 300], [600, 300], [700, 300]];
window.pushPoint = function (startX) {
    window.line.push([startX + 100, 300]);
};''')

while True:
    is_playing = driver.execute_script('return window.isPlaying')

    if not is_playing:
        time.sleep(3)
        replay_button.click()
        time.sleep(2)
        play_button.click()

    pos_now = driver.execute_script('return window.PosNow')
    lines = driver.execute_script('return window.line')
    cp = int(driver.execute_script('return window.CP'))

    now_line_height = -(lines[cp + 1][0] - pos_now[0]) * ((lines[cp + 1][1] - lines[cp][1]) / (lines[cp + 1][0] - lines[cp][0])) + lines[cp + 1][1]

    gap = (now_line_height - 8) - (pos_now[1] - 65)
    print(gap)

    if gap < 15: # jump
        driver.execute_script('mouseListener(new Event("none"))')
        # spacebar.perform()
        time.sleep(0.1)

    time.sleep(0.001)
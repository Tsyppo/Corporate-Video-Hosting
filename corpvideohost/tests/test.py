from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time


class MySeleniumTests(LiveServerTestCase):

    def setUp(self):
        # Указываем путь к драйверу с помощью Service и запускаем браузер с опциями
        service = Service(ChromeDriverManager().install())
        self.browser = webdriver.Chrome(service=service)
        self.browser.delete_all_cookies()
        self.browser.implicitly_wait(10)

    def log_js_errors(self):
        for entry in self.browser.get_log("browser"):
            print(entry)

    def login(self):
        elem = self.browser.find_element(By.NAME, "username")
        elem.send_keys("manager1")
        elem = self.browser.find_element(By.NAME, "password")
        elem.send_keys("12345")
        time.sleep(3)
        login_button = WebDriverWait(self.browser, 10).until(
            EC.element_to_be_clickable((By.XPATH, '//button[@type="submit"]'))
        )
        login_button.click()

    def tearDown(self):
        self.browser.quit()

    def test_login(self):
        # Используем URL фронтенда
        self.browser.get("http://localhost:3000/login")
        time.sleep(3)
        self.assertIn("Login", self.browser.title)

        # Пример взаимодействия с элементами страницы
        elem = self.browser.find_element(By.NAME, "username")
        elem.send_keys("user1")
        elem = self.browser.find_element(By.NAME, "password")
        elem.send_keys("12345")
        login_button = self.browser.find_element(By.XPATH, '//button[@type="submit"]')
        login_button.click()
        self.assertIn("user1", self.browser.page_source)

    def test_logout(self):
        # Используем URL фронтенда
        self.browser.get("http://localhost:3000/login")
        time.sleep(3)
        self.assertIn("Login", self.browser.title)
        # Пример взаимодействия с элементами страницы
        elem = self.browser.find_element(By.NAME, "username")
        elem.send_keys("user1")
        elem = self.browser.find_element(By.NAME, "password")
        elem.send_keys("12345")
        time.sleep(5)
        login_button = WebDriverWait(self.browser, 10).until(
            EC.element_to_be_clickable((By.XPATH, '//button[@type="submit"]'))
        )
        login_button.click()
        username_button = self.browser.find_element(
            By.XPATH, '//button[@id="username"]'
        )
        username_button.click()
        logout_button = self.browser.find_element(By.XPATH, '//li[@id="logout"]')
        logout_button.click()
        self.assertIn("Login", self.browser.page_source)

    def test_favorite(self):
        self.browser.get("http://localhost:3000/login")
        time.sleep(3)
        self.assertIn("Login", self.browser.title)
        # Пример взаимодействия с элементами страницы
        elem = self.browser.find_element(By.NAME, "username")
        elem.send_keys("manager1")
        elem = self.browser.find_element(By.NAME, "password")
        elem.send_keys("12345")
        time.sleep(5)
        login_button = WebDriverWait(self.browser, 10).until(
            EC.element_to_be_clickable((By.XPATH, '//button[@type="submit"]'))
        )
        login_button.click()
        group_button = self.browser.find_element(By.XPATH, '//h2[@id="GroupName"]')
        group_button.click()
        print("Group button clicked")

        time.sleep(1)
        video_button = self.browser.find_element(By.XPATH, '//h2[@id="VideoTitle"]')
        video_button.click()
        print("Video button clicked")

        time.sleep(1)
        add_fav_button = self.browser.find_element(
            By.XPATH, '//button[@id="ButtonAddFav"]'
        )
        add_fav_button.click()
        print("Add to favorite button clicked")

        view_fav = self.browser.find_element(By.XPATH, '//p[@id="favorites"]')
        view_fav.click()
        print("View favorites button clicked")

        time.sleep(1)
        self.assertIn("Видео 5", self.browser.page_source)

    def test_clear_history(self):
        self.browser.get("http://localhost:3000/login")
        time.sleep(3)
        self.assertIn("Login", self.browser.title)
        # Пример взаимодействия с элементами страницы
        self.login()

        view_fav = self.browser.find_element(By.XPATH, '//p[@id="favorites"]')
        view_fav.click()
        print("View favorites button clicked")

        time.sleep(1)
        video_button = self.browser.find_element(By.XPATH, '//h2[@id="VideoTitle"]')
        video_button.click()
        print("Video button clicked")

        time.sleep(1)
        view_history = self.browser.find_element(By.XPATH, '//p[@id="history"]')
        view_history.click()
        print("View history button clicked")

        time.sleep(1)
        clear_button = self.browser.find_element(By.XPATH, '//button[@id="clear"]')
        clear_button.click()
        print("Clear button clicked")

        time.sleep(1)
        self.assertIn("История просмотров пуста", self.browser.page_source)

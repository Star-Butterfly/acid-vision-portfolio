import os
import sys
from datetime import datetime

# --- Конфигурация ---
OUTPUT_FILENAME = "collected_assets.txt"
TARGET_EXTENSIONS = ('.html', '.css', '.js')
# --------------------

def collect_files_to_text_debug():
    """
    Рекурсивно собирает содержимое файлов .html, .css, .js в один .txt файл.
    (С улучшенной логикой инициализации).
    """
    start_path = os.getcwd()
    print(f"Начинаем сканирование в директории: {start_path}")

    total_files_processed = 0

    # 1. Инициализация выходного файла (сразу пишем заголовок)
    try:
        with open(OUTPUT_FILENAME, 'w', encoding='utf-8') as outfile:
            outfile.write(f"--- Сборка активов из директории: {start_path} ---\n")
            outfile.write(f"--- Дата и время сбора: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ---\n")
            outfile.write(f"--- Целевые расширения: {TARGET_EXTENSIONS} ---\n\n")
            
            print(f"Результат будет сохранен в: {OUTPUT_FILENAME}")

    except IOError as e:
        print(f"!!! КРИТИЧЕСКАЯ ОШИБКА: Не удалось создать или записать заголовок в {OUTPUT_FILENAME}: {e}")
        sys.exit(1)


    # 2. Рекурсивный обход директорий
    for root, _, files in os.walk(start_path):
        for filename in files:
            if filename.lower().endswith(TARGET_EXTENSIONS):
                
                full_path = os.path.join(root, filename)
                relative_path = os.path.relpath(full_path, start_path)

                print(f"-> Найдено и обрабатывается: {relative_path}")

                # 3. Запись содержимого в выходной файл (режим 'a' - добавить)
                try:
                    with open(OUTPUT_FILENAME, 'a', encoding='utf-8') as outfile:
                        
                        # Заголовок для файла
                        outfile.write("\n" * 2)
                        outfile.write("=" * 80 + "\n")
                        outfile.write(f"ФАЙЛ: {relative_path}\n")
                        outfile.write("=" * 80 + "\n\n")
                        
                        # Чтение содержимого
                        try:
                            with open(full_path, 'r', encoding='utf-8') as infile:
                                content = infile.read()
                                outfile.write(content)
                                total_files_processed += 1
                        
                        except UnicodeDecodeError:
                            outfile.write(f"[ВНИМАНИЕ: Не удалось прочитать файл {relative_path} как UTF-8.]\n")
                        except Exception as e:
                            outfile.write(f"[ОШИБКА ЧТЕНИЯ ФАЙЛА {relative_path}: {e}]\n")

                except IOError as e:
                    print(f"Критическая ошибка записи в выходной файл при обработке {relative_path}: {e}")


    print("\n" + "="*50)
    if total_files_processed == 0:
        print("!!! ВНИМАНИЕ: Файлы с расширениями .html, .css, .js НЕ БЫЛИ НАЙДЕНЫ в текущей директории и подпапках.")
        print("Сохраненный файл пуст, так как нечего было собирать.")
    else:
        print(f"СБОРКА ЗАВЕРШЕНА! Всего обработано файлов: {total_files_processed}")
    
    print(f"Финальный размер файла {OUTPUT_FILENAME}: {os.path.getsize(OUTPUT_FILENAME)} байт")
    print("="*50)

if __name__ == "__main__":
    collect_files_to_text_debug()